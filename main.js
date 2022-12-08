let countspn = document.querySelector(".count span"),
    bull = document.querySelector(".spans"),
    bullets = document.querySelector(".bullets"),
    sec = document.querySelector("section"),
    btn = document.querySelector(".submit"),
    quizArea = document.querySelector(".quiz-area"),
    footer = document.querySelector("footer"),
    timer = document.querySelector(".timer"),
    currIdx = 0,
    rightAnswers = 0,
    interval;

// Choose Unique Random Number 
function RandomNum (arr, n){
    while(arr.length < n){
        var r = Math.floor(Math.random() * n);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}
function getQts () {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();

    myRequest.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            let qstObj = JSON.parse(this.responseText),
            len = qstObj.length,
            arr = [];
            // Create Bullets
            CreateBullets(len);
            // Choose Unique Random Number Between 0 and 8 
            RandomNum(arr,len);
            // Add Random Question
            AddQtData(qstObj[arr[currIdx]],len);
            // Timer
            CountDown(60,len);
            // Submit
            btn.onclick = function (){
                let rightAns = qstObj[arr[currIdx]].right_answer;
                // CurrIdx To Advance 
                currIdx++;
                // Check Answer
                checkAnswer(rightAns);
                // Pause Previous Interval And Restart function countDown
                clearInterval(interval);
                CountDown(60,len);
                quizArea.innerHTML = '';
                sec.innerHTML = '';
                // Add New Question
                AddQtData(qstObj[arr[currIdx]],len);
                HandleBullets();
                ShowResult(len);
            }
        };
    }
}
getQts();
function CreateBullets(len) {
    countspn.innerHTML = len;  
    for (let i = 0; i < len; i++) {
        let sp = document.createElement("span");
        if (i === 0){
            sp.className = "on";
        }
        bull.appendChild(sp);
    }
}
function AddQtData(numqt, qts){
   if (currIdx < qts) {
    let h2 = document.createElement ("h2");
    h2.appendChild(document.createTextNode(numqt.title));
    quizArea.appendChild(h2);
    RandomNum(tab = [],4);
    // We have 4 choices, that's why we made a loop from 1 to 4 (4 input radio).
    for (let i = 0; i < 4; i++) {
        let div = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label");
        div.className = "answer";
        input.type= "radio";
        input.name = "question";
        input.id = `ans${tab[i]}`;
        input.dataset.answer = numqt[`answer_${tab[i]}`];

        // first input checked
        if (i === 0){
            input.checked = true;
        }
        
        label.htmlFor = `ans${tab[i]}`;
        label.appendChild(document.createTextNode(numqt[`answer_${tab[i]}`]));
        div.appendChild(input);
        div.appendChild(label);
        // sec.insertBefore(div,btn);
        sec.appendChild(div);
    }
   }
}
function checkAnswer(RightAns) {
    // let Answers = document.getElementsByName ("question"),
    let choosenAns = document.querySelector("section .answer input:checked").dataset.answer;
    // for (let i = 0; i < Answers.length; i++) {
    //     if (Answers[i].checked){
    //         choosenAns = Answers[i].dataset.answer;
    //     }
    // }
    // console.log (document.querySelector("section .answer input:checked").dataset.answer)
    if (choosenAns === RightAns){
        rightAnswers++;
    }
}
function HandleBullets() {
    document.querySelectorAll(".bullets .spans span").forEach((sp,i)=> {
        // sp.classList.remove("on");
        if (i === currIdx){
            sp.classList.add("on");
        }
    });
}
function ShowResult(lenQts) {
    if (currIdx === lenQts){
        quizArea.remove();
        sec.remove();
        btn.remove();
        bullets.remove();

        if (rightAnswers > (lenQts / 2) && rightAnswers < lenQts){
            footer.innerHTML = `<span class="good">Good</span>, ${rightAnswers} From ${lenQts}.`;
        }else if (rightAnswers === lenQts) {
            footer.innerHTML = `<span class="perfect">Perfect</span>, All Answers Are Good.`;
        }else {
            footer.innerHTML = `<span class="bad">Bad</span>, ${rightAnswers} From ${lenQts}.`;
        }
        footer.style = "margin-top: 10px;background-color: white;padding: 10px;";
    }
}
function CountDown (duration ,len) {
    if (currIdx < len){
        let min,sec;
        interval = setInterval(() => {
            min = parseInt (duration / 60);
            sec = parseInt (duration % 60);
            
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;
            timer.innerHTML = `${min}:${sec}`;
            if (--duration < 0){
                clearInterval (interval);
                btn.click();
            }
        }, 1000);
    }
}