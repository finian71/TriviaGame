$(document).ready(function() {
  // hide chart canvas
  $('#myChart').hide();

  // setup Question constructor (question, answers and correct)
  function Question(question, answers, correct, url) {
    (this.question = question),
      (this.answers = answers),
      (this.correct = correct),
      (this.url = url);
  }

  // create 5 questions
  questions = [
    new Question(
      'What is the regulation height for a basketball hoop?',
      ['8 feet', '9 feet', '10 feet', '11 feet'],
      '10 feet',
       image = 'assets/images/height.jpg'
    ),
    new Question(
      'Which basketball team did Michael Jordan play for in college?',
      ['University of North Carolina', 'Michigan State University', 'Stanford University', 'University of Southern California'],
      'University of North Carolina',
       images = 'assets/images/jordanunc.jpg'
    ),
    new Question(
      'What was former Denver Nugget David Thompsons nickname?',
      ['Flash', 'The Iceman', 'Skywalker'],
      'Skywalker',
       images = 'assets/images/skywalker.jpg'
    ),
    new Question(
      'What is the record for number of rebounds in an NBA game?',
      ['35', '27', '70', '55'],
      '55',
       images = 'assets/images/wilt55.jpg'
    ),
    new Question(
       'What team owns the longest winning streak in NBA history?',
      [
        'Golden State Warriors',
        'Los Angeles Lakers',
        'Miami Heat',
        'Chicago Bulls',
        'Boston Celtics'
              ],
      'Los Angeles Lakers',
       images = 'assets/images/lakers.jpg'
    )
  ];

  // set intial values for variables
  var questionCounter = 0;
  var time = 20;
  var counter = time;
  var percent = 0;
  var correct = 0;
  var incorrect = 0;

  // step 1: upon clicking start button - hide start button and display first question and answer choices with Time remaining
  $(document).on('click', '#start', function() {
    $(this).hide();
    displayQuestion();
    timer();
  });

  // step 2: upon clicking on answer choice check if answer is correct and respond accordingly
  $(document).on('click', '.answer', function() {
    var chosenAnswer = $(this)
      .text()
      .split(':')[1]
      .trim()
      .toString();

    if (chosenAnswer === questions[questionCounter].correct) {
      correct++;
      $('#trivia').html(
        `<h4> You chose the correct answer!</h4> <hr>  <img class = "img-thumbnail" src = ${
          questions[questionCounter].url
        }>`
      );
    } else {
      incorrect++;
      $('#trivia').html(
        `<h4> You chose the incorrect answer!</h4> <hr> <h4> The correct answer is ${
          questions[questionCounter].correct
        }</h4><img class = "img-thumbnail" src = ${
          questions[questionCounter].url
        }>`
      );
    }
    dispalyNextQuestion();
  });

  // step 3: event handler for reset page
  $(document).on('click', '#reset', function() {
    $('#trivia').html('');
    $(this).hide();
    $('#start').show();
    $('.progress-bar')
      .css('width', '0%')
      .attr('aria-valuenow', 0)
      .text('0%');
    $('#myChart').hide();

    questionCounter = 0;
    correct = 0;
    incorrect = 0;
  });

  // function to display question and answer choices
  function displayQuestion() {
    html = '';
    for (key in questions[questionCounter].answers) {
      var index = parseInt(key) + 1;
      html += `<h3 class = 'answer'>${index}: ${
        questions[questionCounter].answers[key]
      }</h3>`;
    }

    $('#trivia').html(
      `<h4> Time Remaining: <span id='time'>20</span> seconds </h4> <hr> <h2> ${
        questions[questionCounter].question
      }</h2> <p> ${html}`
    );
  }

  // function to add time counter and what to do if no answer is selected
  function timer() {
    interval = setInterval(function() {
      counter--;
      $('#time').text(counter);
      if (counter === 0) {
        incorrect++;
        $('#trivia').html(
          `<h4> You chose the incorrect answer!</p> <p> The correct answer is ${
            questions[questionCounter].correct
          }</h4><img class = "img-thumbnail" src = ${
            questions[questionCounter].url
          }>`
        );
        dispalyNextQuestion();
      }
    }, 1000);
  }

  // function to change question upon choosing an answer choice until all questions have been used
  function dispalyNextQuestion() {
    // display progress bar
    percent = Math.round(((questionCounter + 1) / questions.length) * 100);
    $('.progress-bar')
      .css('width', percent + '%')
      .attr('aria-valuenow', percent)
      .text(percent + '%');

    clearInterval(interval);
    counter = time;
    questionCounter++;
    if (questionCounter < questions.length) {
      setTimeout(function() {
        displayQuestion();
        timer();
      }, 1000 * 5);
    } else {
      clearInterval(interval);
      counter = time;
      setTimeout(lastPage, 5 * 1000);
    }
  }

  // function to display last page as well as summary results
  function lastPage() {
    $('#trivia').html(
      `<hr><h3> Correct: ${correct} </h3><h3> Incorrect: ${incorrect} </h3> <a id="reset" class="btn btn-primary btn-lg" href="#" role="button">Reset</a>`
    );
    $('#myChart').show();
    makeGraph(correct, incorrect);
  }

  // function to create donut plot
  function makeGraph(correct, incorrect) {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [
          {
            data: [correct, incorrect],
            backgroundColor: ['#FF5A5E', '#5AD3D1'],
            hoverBackgroundColor: ['#FF5A5E', '#5AD3D1']
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Trivia Summary'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
});