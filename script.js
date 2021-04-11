$(document).ready(function () {

    //alert();

      // storing all classes into array and adding content dynamically
      var classes = ['col00', 'col01', 'col02', 'col10', 'col11', 'col12', 'col20', 'col21', 'col22'];
      // storing all style classes into array and adding classes
      var classesForColors = ['charColor0', 'charColor1', 'charColor2'];
      // storing all valid combinations into array and checking when required
      var validCombinations = ["MCS", "SCM"];
      // storing all allowed characters
      var chars = ['M', 'C', 'S', '*']
      // storing all allowed wildcharecters
      var wildChard = ['*']
      // storing static wildcharecter class name
      var wildChardClassForColor = 'charColor3';
      var generatedCharsMatrix = [];
      var generatedChars = [];
      var generatedColorsMatrix = [];
      var generatedColors = [];
      var validCombinationsCount = 0;



      $(".blnClick").click(function () {
          console.clear();
          validCombinationsCount = 0;
          $("#validCombs").html("");
          generateMatrix();
      });


      $(".blnScore").click(function () {
          validCombinationsCount = 0;
          generateScore(generatedColorsMatrix, generatedCharsMatrix)

      });


      function generateMatrix() {
          generatedCharsMatrix = []
          generatedChars = []
          generatedColorsMatrix = []
          generatedColors = []

          // Looping over each element of matrix and loading content dynamically
          for (i = 0; i < classes.length; i++) {
              var isWildCard = false;
              var className = classes[i];
              var randNumForChar = getRandom(0, chars.length - 1);
              var randNumForColor = getRandom(0, classesForColors.length - 1);

              generatedChars.push(chars[randNumForChar]);
              if (generatedChars.length == 3) {
                  generatedCharsMatrix.push(generatedChars)
                  generatedChars = []
              }
              var charAtIndex = chars[randNumForChar];
              var colorAtIndex = classesForColors[randNumForColor];

              if (wildChard.indexOf(charAtIndex) > -1) {
                  isWildCard = true;
                  colorAtIndex = wildChardClassForColor;
              }
              else {
                  colorAtIndex = classesForColors[randNumForColor]
              }


              generatedColors.push(colorAtIndex)

              if (generatedColors.length == 3) {
                  generatedColorsMatrix.push(generatedColors)
                  generatedColors = []
              }


              // Appending content dynamically
              var element = "<i class='" + colorAtIndex + "'>" + charAtIndex + "</i>";
              $('.' + className).html(element);
          }
          generateScore(generatedColorsMatrix, generatedCharsMatrix)

      }


      //getRandom method is using for generating random number
      function getRandom(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }


      //generateScore method is using for calculating final score and raising it to no of combinations -1

      function generateScore(colorMatrix, charMatrix) {
          var finalScore = 0;

          finalScore += getAllRows(colorMatrix, charMatrix);
          finalScore += getAllCols(colorMatrix, charMatrix);
          finalScore += getAllDiagonals(colorMatrix, charMatrix);

          finalScore = raiseScore(finalScore, validCombinationsCount);

          $("#scoreContainer").html(finalScore);
          $("#combinationsContainer").html(validCombinationsCount)
      }
      //getting all columns of a matrix
      function getAllRows(colorMatrix, charMatrix) {
          var rowscors = 0;

          for (i = 0; i <= charMatrix.length - 1; i++) {
              if (checkValidCombination(charMatrix[i].join(''))) {
                  var rowVal = calculateCounts(colorMatrix[i]);
                  console.log("row-checkValidCombination"+charMatrix[i].join(''),colorMatrix[i],rowVal);
                  if (rowVal)
                      rowscors += rowVal;
              }
          }
          return rowscors;
      }
      //getting all columns of a matrix
      function getAllCols(colorMatrix, charMatrix) {
          var colscors = 0;
          var find = 1
          
          for (i = 0; i <= charMatrix.length - 1; i++) {
              var colchars = [];
              var colcolors = [];
              for (j = 0; j <= charMatrix.length - 1; j++) {
                  var currArrChar = charMatrix[j];
                  colchars.push(currArrChar[i]);
                  var currArrChar = colorMatrix[j];
                  colcolors.push(currArrChar[i]);
              }

              if (checkValidCombination(colchars.join(''))) {
                  var colVal = calculateCounts(colcolors);
                  console.log("col-checkValidCombination"+colchars.join(''),colcolors,colVal);
                  if (colVal)
                      colscors += colVal;
              }

          }

          
          return colscors
      }

      //getting 2 Diagonals

      function getAllDiagonals(colorMatrix, charMatrix) {
          var diagscors = 0;
          var leftDiagonal = [];
          var leftDiagonalColors = [];
          var rightDiagonal = [];
          var rightDiagonalColors = [];
          var charMatrixLen = charMatrix.length - 1;
          for (i = 0; i <= charMatrixLen; i++) {
              for (j = 0; j <= charMatrixLen; j++) {
                  //calculating left diagonal
                  var currCharArr = charMatrix[i];
                  var currColorArr = colorMatrix[i];
                  if (i == j) {
                      leftDiagonal.push(currCharArr[i]);
                      leftDiagonalColors.push(currColorArr[i]);
                  }
                  //calculating right diagonal
                  if ((i == 0 && j == charMatrixLen)
                      || (j == 0 && i == charMatrixLen)
                      || (i == j && i != 0 && j != 0 && i != charMatrixLen && j != charMatrixLen)) {
                      rightDiagonal.push(currCharArr[j]);
                      rightDiagonalColors.push(currColorArr[j]);

                  }

              }

          }
          if (checkValidCombination(leftDiagonal.join(''))) {
              var leftDiagVal = calculateCounts(leftDiagonalColors);
              console.log("ld-checkValidCombination"+leftDiagonal.join(''),leftDiagonalColors,leftDiagVal);
              if (leftDiagVal)
                  diagscors += leftDiagVal
          }
          if (checkValidCombination(rightDiagonal.join(''))) {
              var rightDiagVal = calculateCounts(rightDiagonalColors);
              console.log("rd-checkValidCombination"+rightDiagonal.join(''),rightDiagonalColors,rightDiagVal);
              if (rightDiagVal)
                  diagscors += rightDiagVal
          }
          return diagscors;
      }

      //Calculating Counts for color classes

      function calculateCounts(matrix) {
          var colorsUsed = [];
          var sameCount = 0;
          var uniqueCount = 0;

          if (matrix) {
              for (matrixIndex = 0; matrixIndex <= matrix.length - 1; matrixIndex++) {
                  var currColor = matrix[matrixIndex];
                 
                  if (currColor == wildChardClassForColor) {
                      sameCount += 1;
                      uniqueCount += 1;
                      colorsUsed.push(wildChardClassForColor  );
                  }
                  else if (colorsUsed.indexOf(currColor) > -1) {
                      sameCount += 1;
                  }
                  else {
                      if(matrixIndex == 0 || colorsUsed.every( v => v === wildChardClassForColor )){
                        sameCount += 1;
                      }
                      uniqueCount += 1;
                      colorsUsed.push(currColor);
                  }
              }
          }


          return calculateScore(sameCount, uniqueCount)
      }

      // Calculating scores here

      /**
       *
       *     Valid combinations (MCS or SCM)	Points
             Vertical, Horizontal, Diagonal - Any colours	1
             Vertical, Horizontal, Diagonal - Unique colours	2
             Vertical, Horizontal, Diagonal - Same colours	3
       */
      function calculateScore(sameCountVal, uniqueCountVal) {
          var score = 0;
          var allSame = 3;
          var allUnique = 2;
          var allRandom = 1;

          if (sameCountVal >= 3) {
              score += allSame;
          }
          else if (uniqueCountVal >= 3) {
              score += allUnique;
          }
          else {
              score += allRandom;
          }

          return score;
      }
      //Using checkValidCombination method for checking weather the string is valid combination or not
      function checkValidCombination(str) {
          //console.log(str);
          for (comb = 0; comb <= validCombinations.length - 1; comb++) {
              var isValid = true;
              var combi = validCombinations[comb]
              for (combIndex = 0; combIndex <= combi.length - 1; combIndex++) {
                  if (str[combIndex] != combi[combIndex] && wildChard.indexOf(str[combIndex]) == -1) {
                      isValid = false;
                      break;
                  }
              }
              if (isValid) {
                  //console.log("checkValidCombination=>"+str);
                  $("#validCombs").append(str + "<br />");
                  validCombinationsCount += 1;
                  return isValid
              }

          }
          return isValid;

      }

      //Using raiseScore method for calculating power of a final score
      function raiseScore(score, foundCombinations) {
          console.log(score, foundCombinations);
          if (score <= 1 || foundCombinations <=1)
              return score;

          var raisedScore = 1;
          for (scoreIndex = 1; scoreIndex < foundCombinations; scoreIndex++) {
              raisedScore *= score;
          }
          return raisedScore;
      }

  });