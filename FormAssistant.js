// This jQuery function handles closing of the assistant
$("#noAssistant").click(function() {
  $("#page-assistant").css("animation", "load_left 0.5s forwards");
  var inputBox = document.getElementsByTagName('input');

  for (var i = 0; i < inputBox.length; i++) {
    inputBox[i].disabled = false;
  }
});

function closeClicked() {
  document.getElementById('page-assistant').style.animation = "load_left 0.5s forwards";
  var inputBox = document.getElementsByTagName('input');

  for (var i = 0; i < inputBox.length; i++) {
    inputBox[i].disabled = false;
  }
}

// This jQuery function starts the assistant's step-by-step helper
$("#yesAssistant").click(function() {
  completeForm();
});

// This function handles affirmation of the assistant's step-by-step helper
var errorAssistant;

function okClicked() {
  if (assistantInputCounter < luminText.length-1) {
    var inputBox = document.getElementsByTagName('input');

    //This code is for reading xml files
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","data.xml",false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    //XML Reader variable declarations
    allEntries = xmlDoc.getElementsByTagName("entry");
    reqClass = new Array(allEntries.length);
    reqDataType = new Array(allEntries.length);
    reqExamples = new Array(allEntries.length);

    //XML Reading: Entries from each column in XML doc is being read and entered in the arrays declared above
    for (var i = 0; i < allEntries.length; i++) {
      reqClass[i] = xmlDoc.getElementsByTagName("className")[i].childNodes[0].nodeValue;
      reqDataType[i] = xmlDoc.getElementsByTagName("dataType")[i].childNodes[0].nodeValue;
      reqExamples[i] = xmlDoc.getElementsByTagName("examples")[i].childNodes[0].nodeValue;
    }
    //Cycle through each entry in the data file and find the class that match with the inputBox
    for (var j = 0; j < allEntries.length; j++) {
      if (inputBox[assistantInputCounter].className == reqClass[j]) {
        isIssue = checkIssues(reqDataType[j], inputBox[assistantInputCounter].value, inputBox[assistantInputCounter].placeholder, inputBox[assistantInputCounter].maxLength);
        if (isIssue) {
          document.getElementById('assistant-message').innerHTML = "<h5>" + errorAssistant + "</h5><div class='row'><button type='button' class='btn btn-primary btn-xl' id='okAssistant' onclick='okClicked()'>OK</button></div>";
          inputBox[assistantInputCounter].focus();
          return 0;
        }
      }
    }
  }

  assistantInputCounter++;
  completeForm();
}

// This function handles travel through input fields in the assistant
var assistantInputCounter = 0;

function completeForm() {
  var inputBox = document.getElementsByTagName('input');

  for (var i = 0; i < inputBox.length; i++) {
    inputBox[i].disabled = true;
  }

  if (assistantInputCounter < luminText.length-1) {
    inputBox[assistantInputCounter].disabled = false;
    inputBox[assistantInputCounter].select();
  }
  document.getElementById('assistant-message').innerHTML = luminText[assistantInputCounter];
}

var allEntries = [];
var reqClass = [];
var reqDataType = [];
var reqExamples = [];

// This function handles submission of the form
function submitForm() {
    var inputBox = document.getElementsByTagName('input');
    var isIssue = false;

    //This code is for reading xml files
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","data.xml",false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    //XML Reader variable declarations
    allEntries = xmlDoc.getElementsByTagName("entry");
    reqClass = new Array(allEntries.length);
    reqDataType = new Array(allEntries.length);
    reqExamples = new Array(allEntries.length);

    //XML Reading: Entries from each column in XML doc is being read and entered in the arrays declared above
    for (var i = 0; i < allEntries.length; i++) {
      reqClass[i] = xmlDoc.getElementsByTagName("className")[i].childNodes[0].nodeValue;
      reqDataType[i] = xmlDoc.getElementsByTagName("dataType")[i].childNodes[0].nodeValue;
      reqExamples[i] = xmlDoc.getElementsByTagName("examples")[i].childNodes[0].nodeValue;
    }

    //Cycle through each inputBox
    for (var i = 0; i < inputBox.length; i++) {
      //Cycle through each entry in the data file and find the class that match with the inputBox
      for (var j = 0; j < allEntries.length; j++) {
        if (inputBox[i].className == reqClass[j]) {

          isIssue = checkIssues(reqDataType[j], inputBox[i].value, inputBox[i].placeholder, inputBox[i].maxLength);
          if (isIssue) {
            document.getElementById('page-assistant').style.animation = "load_right 0.5s forwards"
            document.getElementById('assistant-message').innerHTML = "<h5>" + errorAssistant + "</h5><div class='row'><button type='button' class='btn btn-primary btn-xl' id='okAssistant' onclick='okClicked()'>OK</button></div>";
            inputBox[assistantInputCounter].focus();
            return 0;
          }
          else {
            document.getElementById('assistant-message').innerHTML = "<h5>Congratulations! Your request has been submitted.</h5><div class='row'><button type='button' class='btn btn-primary btn-xl' id='noAssistant' onclick='closeClicked()'>Close</button></div>";
          }
        }

      }
    }
}

// This function handles error-checking of the form data
var originalPass;

function checkIssues(restriction, inputValue, defaultInput, correctLength) {
  var feedback;

  if (inputValue.length == 0) {
    feedback = "ERROR: Please enter your " + defaultInput + ".";
    if (correctLength == 4) {
      feedback = "ERROR: Please enter your 4-digit pin.";
    }
    else if (correctLength == 3) {
      feedback = "ERROR: Please enter your 3-digit pin.";
    }
    errorAssistant = feedback;
    return true;
  }

  if (restriction == "spaceless") {
    // alert(defaultInput);
    var indices = [];
    feedback = "ERROR: The input " + inputValue + " should not have spaces. You have put spaces in the ";
    for(var i=0; i<inputValue.length;i++) {
        if (inputValue[i] == " ") indices.push(i);
    }

    if (indices.length == 0) {
      return false;
    }
    else {

      for (var i = 0; i < indices.length; i++) {
        if (i == indices.length-1) {
          feedback += indices[i]+1;
        }
        else {
          feedback += indices[i]+1;
        }

        if (indices[i] == 1) {
          feedback += "st";
        }
        else if (indices[i] == 2) {
          feedback += "nd";
        }
        else if (indices[i] == 3) {
          feedback += "rd";
        }
        else {
          feedback += "th";
        }

        if (i != indices.length-1) {
          feedback += ", ";
        }
        else {
          feedback += " ";
        }
      }

      if (indices.length > 1) {
        feedback += "spots. Please remove them.";
      }
      else {
        feedback += "spot. Please remove it.";
      }
      errorAssistant = feedback;
      return true;
    }

    return false;
  }

  if (restriction == "email") {
    var atIndex = inputValue.indexOf("@")
    var domainEndings = [".com", ".net", ".ca", ".co.uk", ".net", ".fr", ".de", ".it", ".live", ".me"];
    var matchDomEnd;
    var domEndIndex = -1;
    var domCounter = 0;

    if (atIndex == -1) {
      feedback = "ERROR: Your email address does not have an \'@\' symbol. It is invalid.";
      errorAssistant = feedback;
      return true;
    }

    while (domEndIndex == -1 && domCounter < domainEndings.length) {
      domEndIndex = inputValue.indexOf(domainEndings[domCounter]);
      matchDomEnd = domainEndings[domCounter];
      domCounter++;
    }

    if (domEndIndex == -1) {
      feedback = "ERROR: Your email address does not have a valid domain ending. Examples of endings include: ";
      for (var i = 0; i < 3; i++) {
        if (i == 2) {
          feedback += domainEndings[i] + ".";
        }
        else {
          feedback += domainEndings[i] + ", ";
        }
      }
      errorAssistant = feedback;
      return true;
    }

    if (domEndIndex-1 <= atIndex) {
      feedback = "ERROR: Your email address domain cannot exist before the \'@\' symbol. Move your domain (i.e. gmail.com) behind the \'@\' symbol.";
      errorAssistant = feedback;
      return true;
    }

    return false;
  }

  if (restriction == "password") {
    var isCapital = false;
    var isSmall = false;
    var isNumber = false;
    var isSpecialChar = false;

    if (inputValue.length < 8) {
      feedback = "ERROR: Password must be at least 8 characters long.";
      errorAssistant = feedback;
      return true;
    }

    for (var i = 0; i < inputValue.length; i++) {
      // alert(inputValue.charCodeAt(i));
      if (inputValue.charCodeAt(i) >= 65 && inputValue.charCodeAt(i) <= 90) {
        isCapital = true;
      }
      else if (inputValue.charCodeAt(i) >= 97 && inputValue.charCodeAt(i) <= 122) {
        isSmall = true;
      }
      else if (inputValue.charCodeAt(i) >= 48 && inputValue.charCodeAt(i) <= 57) {
        isNumber = true;
      }
      else if (inputValue.charCodeAt(i) >= 32 && inputValue.charCodeAt(i) <= 126) {
        isSpecialChar = true;
      }
    }

    if (!isCapital) {
      feedback = "ERROR: Password must have at least one upper-case letter.";
      errorAssistant = feedback;
      return true;
    }
    if (!isSmall) {
      feedback = "ERROR: Password must have at least one lower-case letter.";
      errorAssistant = feedback;
      return true;
    }
    if (!isNumber) {
      feedback = "ERROR: Password must have at least one number.";
      errorAssistant = feedback;
      return true;
    }
    if (!isSpecialChar) {
      feedback = "ERROR: Password must have at least one special character.";
      errorAssistant = feedback;
      return true;
    }

    if (defaultInput == "Password") {
      originalPass = inputValue;
    }

    if (defaultInput == "Confirm Password") {
      if (originalPass != inputValue) {
        feedback = "ERROR: The password you re-entered does not match the original.";
        errorAssistant = feedback;
        return true;
      }
    }

  }

  if (restriction == "spaceless-num") {

    if (inputValue.length != correctLength) {
      feedback = "ERROR: Your input for the " + correctLength + "-digit pin does not meet the requirements. Please make it " + correctLength + " digits long.";
      errorAssistant = feedback;
      return true;
    }

    for (var i = 0; i < inputValue.length; i++) {
      if (isNaN(inputValue[i])) {
        feedback = "ERROR: Your input for the " + correctLength + "-digit pin must be only numbers.";
        errorAssistant = feedback;
        return true;
      }
    }
  }

}
