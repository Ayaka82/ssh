document.addEventListener("DOMContentLoaded", function () {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentYear, currentMonth;

    const hints = [
        { id: 1, title: "数学自主レポート", time: "1~3h", month: "通年", advice: ["-", "-"] },
        { id: 2, title: "歴史プロセスシート", time: "2h", month: "毎学期末", advice: ["・毎授業で記入することを強くお勧めします。"] },
        { id: 3, title: "地学マインドマップ", time: "2~3h", month: "毎学期末", advice: ["・上手い人のを参考にすると良い。", "・たくさんの情報を細かく書くのではなくて、いかにまとめられるかがこの課題のポイントかと。"] },
        { id: 4, title: "マラソンレポート", time: "1.5~2h", month: "2月", advice: ["-", "-"] },
        { id: 5, title: "保健生徒授業", time: "3~4h", month: "1~3月", advice: ["・アンケートや検証などはできるうちに早めに行ない、フィードバックを踏まえてもう一度できるようにする。"] },
        { id: 6, title: "地学実習", time: "4.5~5h", month: "11月", advice: ["・班員との情報共有をきちんと行うことや現場での観察事項をすべて正確にメモしておくことが大切です。", "・城ヶ島でなるべく終わらせておいた方がいい。", "・事前知識を完璧にしておくべきです。何も知らずに実習に行っても地獄を見るだけです。"] },
        { id: 7, title: "地理生徒授業", time: "5h~", month: "1~3月", advice: ["・毎日コツコツ調べること。具体的な目標やテーマをかかげること。抽象的なテーマにすると考察するべき課題が多く深めきれないので、穴を埋めるために莫大な時間を要する。", "・分担を行う際は早めに、かつやることを明確にすること。初期の話し合いはLINEではなく、対面で行うこと。余裕のあるうちから始めること。", "・資料集めの時間にしっかり集めた人間が勝つ。", "・とりあえずわからなかったり行き詰まったりしたら先生に相談に行き、助言をいただくことをお勧めします。道筋と、何を明らかにしたいのかを明確にしておくと良いです。考察はみんなで考えた方が良い。", "・班の協力が必須だと思います。特にレポートは振り分けて取り組むと効率的です。授業は興味を引くような構成にしましょう。", "・最初にしっかり方針を立て、上手く行かなそうならすぐに方針を見直すこと。"] },
        { id: 8, title: "地理実習", time: "4~4.5h", month: "6月", advice: ["・地理実習当日にやることをきっちり共有して課題を終わらせること。", "・実習中にちゃんとレポートのことを考えて歩く。メモは内容がわかりやすいように沢山取っておいた方がいい。", "・入学したてにしては大変な課題だと思います。なるべく実習中に終わらせることがコツです。自分の研究については最悪、別日でも実施可能なので何を終わらせなければいけないか明確にしましょう。", "・記憶が鮮明なうちにやれ。"] },
        { id: 9, title: "プチ探求", time: "3.5h~", month: "6~9月", advice: ["・班員としっかり作業を分担して作業量が偏らないようにする。", "・最初の方向性決めでなるべく早く具体的に案を決める。"] }
    ];

    const taskTemplates = [
        { title: "数学自主レポート", date: "2025-03-31", memo: "", motivation: 50 },
        { title: "歴史プロセスシート", date: "2025-02-28", memo: "", motivation: 75 },
        { title: "地学マインドマップ", date: "2025-04-30", memo: "", motivation: 60 }
    ];

    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(screenId).style.display = 'block';
        if (screenId === 'screen6') {
            renderRecords();
        } else if (screenId === 'screenHint') {
            renderHints();
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            const screenId = this.getAttribute('data-screen');
            showScreen(screenId);
            if (screenId === 'screen3') {
                createCalendar(currentYear, currentMonth);
            }
        });
    });

    showScreen('screen1');

    function renderUpcomingTasks() {
        console.log("renderUpcomingTasks called");  // 関数が呼び出されたことを確認
        const upcomingTaskList = document.getElementById('upcomingTaskList');
        const pastTaskList = document.getElementById('pastTaskList');
        const lowMotivationTaskList = document.getElementById('lowMotivationTaskList');

        if (!upcomingTaskList || !pastTaskList || !lowMotivationTaskList) {
            console.error("One of the task list elements is not found");
            return;
        }

        upcomingTaskList.innerHTML = '';
        pastTaskList.innerHTML = '';
        lowMotivationTaskList.innerHTML = '';

        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);

        tasks.forEach(task => {
            const taskDate = new Date(task.date);
            const listItem = document.createElement('li');
            listItem.textContent = `${task.title} - 締切: ${task.date}`;
            console.log(`Processing task: ${task.title}, date: ${task.date}, motivation: ${task.motivation}`); // タスクが処理されていることを確認

            // 完了ボタンの追加
            const completeButton = document.createElement('button');
            completeButton.textContent = '完了';
            completeButton.addEventListener('click', () => {
                task.completed = true;
                task.completedDate = new Date();
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderUpcomingTasks();
                renderRecords();
            });

            // 削除ボタンの追加
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderUpcomingTasks();
            });

            // 編集ボタンの追加
            const editButton = document.createElement('button');
            editButton.textContent = '編集';
            editButton.addEventListener('click', () => {
                openEditTaskPopup(task);
            });

            listItem.appendChild(completeButton);
            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);

            if (taskDate < today) {
                pastTaskList.appendChild(listItem);
                console.log(`Added to pastTaskList: ${task.title}`);
            } else if (taskDate <= oneWeekLater) {
                upcomingTaskList.appendChild(listItem);
                console.log(`Added to upcomingTaskList: ${task.title}`);
            }

            if (task.motivation < 30) {
                const lowMotivationItem = document.createElement('li');
                lowMotivationItem.textContent = `${task.title} - 締切: ${task.date}`;
                lowMotivationTaskList.appendChild(lowMotivationItem);
                console.log(`Added to lowMotivationTaskList: ${task.title}`);
            }
        });
    }

    renderUpcomingTasks();

    function renderRecords() {
        const stampGrid = document.getElementById('stampGrid');
        stampGrid.innerHTML = '';

        const completedTasks = tasks.filter(task => task.completed);

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'stamp-cell';
            if (i < completedTasks.length) {
                cell.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                cell.textContent = new Date(completedTasks[i].completedDate).toLocaleDateString();
            }
            stampGrid.appendChild(cell);
        }
    }

    function createCalendar(year, month) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        currentYear = year;
        currentMonth = month;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const calendarHeader = document.getElementById('calendar-month-year');
        calendarHeader.textContent = `${year}年 ${month + 1}月`;

        const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
        const calendarDaysRow = document.createElement('div');
        calendarDaysRow.className = 'calendar-days-row';
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarDaysRow.appendChild(dayElement);
        });
        calendar.appendChild(calendarDaysRow);

        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';

        let dayCounter = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 月曜始まりに調整
        for (let i = 0; i < dayCounter; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-cell empty';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.textContent = day;

            // タスクをカレンダーに表示
            const taskDate = new Date(year, month, day);
            const taskList = document.createElement('ul');
            taskList.className = 'task-list';
            tasks.forEach(task => {
                const taskDueDate = new Date(task.date);
                if (taskDueDate.toDateString() === taskDate.toDateString()) {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = task.title;
                    taskItem.addEventListener('click', () => showTaskDetail(task));
                    taskList.appendChild(taskItem);
                }
            });
            cell.appendChild(taskList);

            calendarGrid.appendChild(cell);
        }

        calendar.appendChild(calendarGrid);
    }

    function renderHints() {
        const hintList = document.getElementById('hintList');
        hintList.innerHTML = '';
        hints.forEach(hint => {
            const hintItem = document.createElement('li');
            hintItem.textContent = hint.title;
            hintItem.addEventListener('click', () => showHintDetail(hint));
            hintList.appendChild(hintItem);
        });
    }

    function showTaskDetail(task) {
        document.getElementById('taskDetailTitle').textContent = `タイトル: ${task.title}`;
        document.getElementById('taskDetailDate').textContent = `締切: ${task.date}`;
        document.getElementById('taskDetailMemo').textContent = `メモ: ${task.memo}`;
        document.getElementById('taskDetailMotivation').textContent = `やる気: ${task.motivation}`;
        document.getElementById('taskDetailPopup').style.display = 'block';
    }

    function showHintDetail(hint) {
        document.getElementById('hintDetailTitle').textContent = `タイトル: ${hint.title}`;
        document.getElementById('hintDetailTime').textContent = `時間: ${hint.time}`;
        document.getElementById('hintDetailMonth').textContent = `月: ${hint.month}`;
        const hintDetailAdvice = document.getElementById('hintDetailAdvice');
        hintDetailAdvice.innerHTML = '';
        hint.advice.forEach(advice => {
            const adviceItem = document.createElement('li');
            adviceItem.textContent = advice;
            hintDetailAdvice.appendChild(adviceItem);
        });
        document.getElementById('hintDetailPopup').style.display = 'block';
    }

    function renderTaskTemplates() {
        const taskTemplateList = document.getElementById('taskTemplateList');
        taskTemplateList.innerHTML = '';
        taskTemplates.forEach(template => {
            const templateItem = document.createElement('li');
            templateItem.textContent = template.title;
            templateItem.addEventListener('click', () => addTaskFromTemplate(template));
            taskTemplateList.appendChild(templateItem);
        });
    }

    function addTaskFromTemplate(template) {
        const taskFormContainer = document.getElementById('taskFormContainer');
        
        const taskForm = document.createElement('div');
        taskForm.className = 'task-form';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = template.title;
        titleInput.placeholder = 'タイトルを入力';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = template.date;

        const memoInput = document.createElement('textarea');
        memoInput.placeholder = 'メモを入力';
        memoInput.value = template.memo;

        const motivationInput = document.createElement('input');
        motivationInput.type = 'range';
        motivationInput.min = 0;
        motivationInput.max = 100;
        motivationInput.value = template.motivation;

        taskForm.appendChild(titleInput);
        taskForm.appendChild(dateInput);
        taskForm.appendChild(memoInput);
        taskForm.appendChild(motivationInput);

        taskFormContainer.appendChild(taskForm);
    }

    document.getElementById('addTaskButton').addEventListener('click', () => {
        renderTaskTemplates();
        document.getElementById('taskPopup').style.display = 'block';
    });

    document.getElementById('addTemplateButton').addEventListener('click', () => {
        renderTaskTemplates();
        document.getElementById('taskTemplatePopup').style.display = 'block';
    });

    document.getElementById('closeTaskDetailPopup').addEventListener('click', () => {
        document.getElementById('taskDetailPopup').style.display = 'none';
    });

    document.getElementById('closeHintDetailPopup').addEventListener('click', () => {
        document.getElementById('hintDetailPopup').style.display = 'none';
    });

    document.getElementById('closeTaskTemplatePopup').addEventListener('click', () => {
        document.getElementById('taskTemplatePopup').style.display = 'none';
    });

    document.getElementById('closePopup').addEventListener('click', () => {
        document.getElementById('taskPopup').style.display = 'none';
    });

    document.getElementById('saveTasksButton').addEventListener('click', () => {
        const taskFormContainer = document.getElementById('taskFormContainer');
        const taskForms = taskFormContainer.getElementsByClassName('task-form');

        for (const taskForm of taskForms) {
            const title = taskForm.querySelector('input[type="text"]').value.trim();
            const date = taskForm.querySelector('input[type="date"]').value;
            const memo = taskForm.querySelector('textarea').value;
            const motivation = taskForm.querySelector('input[type="range"]').value;

            if (title && date) {
                const task = { id: Date.now(), title, date, memo, motivation, completed: false };
                tasks.push(task);
            }
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderUpcomingTasks();
        createCalendar(currentYear, currentMonth);  // タスク追加後にカレンダーを更新
        document.getElementById('taskPopup').style.display = 'none';
    });

    function openEditTaskPopup(task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDate').value = task.date;
        document.getElementById('editTaskMemo').value = task.memo;
        document.getElementById('editTaskMotivation').value = task.motivation;
        document.getElementById('editTaskPopup').style.display = 'block';
    }

    document.getElementById('editTaskSubmit').addEventListener('click', () => {
        const taskId = document.getElementById('editTaskId').value;
        const taskTitle = document.getElementById('editTaskTitle').value.trim();
        const taskDate = document.getElementById('editTaskDate').value;
        const taskMemo = document.getElementById('editTaskMemo').value;
        const taskMotivation = document.getElementById('editTaskMotivation').value;

        tasks = tasks.map(task => {
            if (task.id == taskId) {
                return { ...task, title: taskTitle, date: taskDate, memo: taskMemo, motivation: taskMotivation };
            }
            return task;
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderUpcomingTasks();
        createCalendar(currentYear, currentMonth);
        document.getElementById('editTaskPopup').style.display = 'none';
    });

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        createCalendar(currentYear, currentMonth);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        createCalendar(currentYear, currentMonth);
    });

    // Initialize calendar with current month and year
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    createCalendar(currentYear, currentMonth);

    // テストデータの追加
    tasks = [
        { id: 1, title: "Task 1", date: "2025-01-23", memo: "Test memo 1", motivation: 20, completed: false },
        { id: 2, title: "Task 2", date: "2025-01-25", memo: "Test memo 2", motivation: 50, completed: false },
        { id: 3, title: "Task 3", date: "2025-02-01", memo: "Test memo 3", motivation: 10, completed: false },
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderUpcomingTasks();
});