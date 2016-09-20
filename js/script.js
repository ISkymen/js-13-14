"use strict";

// Main function for generate DOM element (Page title, questions list, buttons)
var page = {
  Title: function (title) {
    var blockTitle = document.createElement("h1");
    blockTitle.innerHTML = title;
    blockTitle.className = "page-title";
    document.body.appendChild(blockTitle);
  },

  Question: function (questions) {
    var questionList = document.createElement("ol");
    document.body.appendChild(questionList);

    for (var i = 0; i < questions.length; i++) {

      var questionItem = document.createElement("li");
      questionItem.className = "question-block";
      questionList.appendChild(questionItem);

      var blockQuestion = document.createElement("h2");
      blockQuestion.innerHTML = questions[i].question;
      blockQuestion.className = "question";
      questionItem.appendChild(blockQuestion);

      var list = document.createElement("ul");
      list.className = "answer__list";
      questionItem.appendChild(list);

      for (var j = 0; j < questions[i].answers.length; j++) {
        var listItem = document.createElement("li");
        var listInput = document.createElement("input");
        var listLabel = document.createElement("label");
        listInput.setAttribute("type", "checkbox");
        listItem.className = "answer__item";

        listLabel.innerHTML = questions[i].answers[j].substr(2);
        list.appendChild(listItem);
        listItem.appendChild(listLabel);
        listLabel.insertBefore(listInput, listLabel.firstChild);
      }
    }
  },

  Button: function (button) {
    var blockButton = document.createElement("button");
    blockButton.addEventListener('click', check);
    blockButton.innerHTML = button;
    blockButton.className = "button";
    document.body.appendChild(blockButton);
  }
};

// Get JSON from file and put it to localStorage
var xmlhttp = new XMLHttpRequest();
var url = "question.json";

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    localStorage.setItem("Questions", this.responseText);
  }
};

xmlhttp.open("GET", url, false);
xmlhttp.send();

// Parse JSON from localStorage (get Questions object)
var pageQuestions = JSON.parse(localStorage.getItem("Questions"));

// Main function for generate start page
function displayPage() {
  var pageQuestions = JSON.parse(localStorage.getItem("Questions"));
  console.log(pageQuestions);
  document.body.innerHTML = '<div id="myModal" class="modal"><div class="modal-content"><div class="modal-header"><span class="close">×</span><h2>Результаты теста</h2></div><div class="modal-body"></div><div class="modal-footer"><button id="start" type="button" class="button">Начать тест сначала</button></div></div>';
  page.Title("Тест по программированию");
  page.Question(pageQuestions);
  page.Button("Проверить мои результаты");
}

displayPage();

// Generate array with correct answers codes
var checkArray = [];
for (var i = 0; i < pageQuestions.length; i++) {
  checkArray[i] = "";
  for (var j = 0; j < pageQuestions[i].answers.length; j++) {
    checkArray[i] += pageQuestions[i].answers[j].substr(0, 1);
  }
}

// Function for check correct answers
function check() {
  var checkBox = document.getElementsByClassName("answer__list");
  var checkBoxArray = [];
  for (var i = 0; i < checkBox.length; i++) {
    checkBoxArray[i] = "";
    for (var j = 0; j < checkBox[i].getElementsByTagName('input').length; j++) {
      checkBoxArray[i] += (+checkBox[i].getElementsByTagName('input')[j].checked + "");
    }
  }

  if (checkBoxArray.length == checkArray.length) {
    var correctAnswers = 0;
    for (var k = 0; k < checkBoxArray.length; k++) {
      if (checkBoxArray[k] != checkArray[k]) {

        checkBox[k].className = "answer__list wrong";
      }
      else {
        checkBox[k].className = "answer__list correct";
        correctAnswers += 1;
      }
    }
    var testResult;
    if (correctAnswers == checkBoxArray.length) {
      testResult = "Поздравляем! Вы правильно ответили на все вопросы."
    }
    else {
      if (correctAnswers == 0) {
        testResult = "Вы не смогли ответить правильно ни на один вопрос :("
      }

      else {
        testResult = "Вы ответили правильно на " + correctAnswers + " из " + checkBoxArray.length + " вопросов.";
      }
    }
  }

  // Modal window
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("close")[0];
  var start = document.getElementById("start");
  var modalBody = document.getElementsByClassName("modal-body")[0];

  modalBody.innerHTML = "<h2>" + testResult + "</h2>";
  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  }

  start.onclick = function () {
    modal.style.display = "none";
    displayPage();
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}




