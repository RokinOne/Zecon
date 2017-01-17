var dek, el;
var inputDec = document.getElementById("dec");
var inputDoz = document.getElementById("doz");
var numpadOn = 0;
var showInfo = false;
var tempVal;
var focus = inputDec;

switchSet(1);
inputDec.focus();

function toggleInfo () {
  var info = document.getElementById("info");
  if (showInfo) {
    showInfo = false;
    info.style.width = "60px";
    info.style.height = "60px";
  } else {
    showInfo = true;
    info.style.width = "350px";
    info.style.height = "auto";
  }
}

function toggleNumpad () {
  var numpad = document.getElementById("numpad");
  var padButtons = numpad.children;
  var display;
  if (numpadOn == 1) {
    display = "none";
    numpadOn = 0;
  } else {
    display = "inline-block";
    numpadOn = 1;
  }
  for (var i = 0; i < 14; i++) {
    padButtons[i].style.display = display;
  }
}

function focusEl (el) {
  switch (el) {
    case dec: focus = inputDec; validateDec(inputDec.value); break;
    case doz: focus = inputDoz; validateDoz(inputDoz.value); break;
  }
}

function switchSet (set) {
  switch (set) {
    case 1: dek = "A"; el = "B"; break;
    case 2: dek = "a"; el = "b"; break;
    case 3: dek = "T"; el = "E"; break;
    case 4: dek = "t"; el = "e"; break;
    case 0: default: dek = "ᘔ"; el = "Ɛ"; break;
  }
  numpad.children[11].innerHTML = dek;
  numpad.children[12].innerHTML = el;
  updateDoz();
}

function updateDoz () {
  tempVal = inputDec.value;
  if (tempVal == "") inputDoz.value = "";
  else if (validateDec(tempVal)) inputDoz.value = toDoz (tempVal);
}

function updateDec () {
  var good = 0;  
  inputDoz.className = "";
  tempVal = inputDoz.value;
  good = validateDoz(tempVal);
  if (tempVal == "") inputDec.value = "";
  else if (good) inputDec.value = toDec (tempVal);
}

function validateDec (value) {
  var good = 0;
  var re = new RegExp("^-?[0-9]*[,|\.]?[0-9]*$");
   
  good = re.test(value);
  if (good == 1) inputDec.className = "valid";
  else inputDec.className = "invalid";
 
  return good;
}

function validateDoz (value) {
  var good = 0;
  var re = RegExp("^-?[0-9abABteTEᘔƐ]*[,|\.]?[0-9abABteTEᘔƐ]*$");
 
  good = re.test(value);
  if (good == 1) inputDoz.className = "valid";
  else inputDoz.className = "invalid";
 
  return good;
}

function update (button) {
  focus.value += button.innerHTML;

  switch (focus.id) {
    case "dec": updateDoz(); break;
    case "doz": updateDec(); break;
  }
}

function checkDek (digit) {
  switch (digit) {
    case "A": case "a": case "T": case "t": case "*": case "ᘔ": return 1; break;
    default: return 0; break;
  }
}

function checkEl (digit) {
  switch (digit) {
    case "B": case "b": case "E": case "e": case "#": case "Ɛ": return 1; break;
    default: return 0; break;
  }
}

function toDec (dozenal) {
  var pos = 1;
  var result = 0;
  var digit;
  var fractLength;
  var sections;

  var re = RegExp(",");
  if (re.test(dozenal)) {
    sections = dozenal.split(",");
  }
  else sections = dozenal.split(".");

  dozArray = sections[0].split("");
  while (dozArray.length != 0) {
    digit = dozArray.pop();
    if (checkDek(digit)) { result += (10 * pos); }
    else if (checkEl(digit)) { result += (11 * pos); }
    else { result += (parseInt(digit) * pos); }
    pos *= 12;
  }

  if (sections[1] != null) {
      dozArray = sections[1].split("");
      fractLength = dozArray.length;
      pos = 1/12;
      while (dozArray.length != 0) {
        digit = dozArray.shift();
        if (checkDek(digit)) { result += (10 * pos); }
        else if (checkEl(digit)) { result += (11 * pos); }
        else { result += (parseInt(digit) * pos); }
        pos /= 12;
      }
  }

  return result.toFixed(fractLength);
}

function toDozWhole (decimal) {
  var result = "";
  var digits = [];

  while (decimal > 11) {
    digits.push(decimal % 12);
    decimal = Math.floor(decimal/12);
  }

  digits.push(decimal);

  for (var i = (digits.length-1); i >= 0; i--) {
    if (digits[i] == 10) digits[i] = dek;
    else if (digits[i] == 11) digits[i] = el;
    result += digits[i];
  }

  return result;
}

function toDoz (decimal) {
  var result = "";
  var tempWh;

  var re = RegExp(",");
  if (re.test(decimal)) {
    decimal = decimal.split(",");
  }
  else decimal = decimal.split(".");
  
  var whole = decimal[0];
  var fract = decimal[1];

  result += toDozWhole(decimal[0]);

  if (fract != null) {
    result += ".";
    fractLength = fract.toString().length;

    for (i = 0; i < fractLength; i++) {
      tempWh = fract * 12;
      tempWh /= Math.pow(10, fractLength);
      tempWh = Math.floor(tempWh);

      if (tempWh == 10) result += dek;
      else if (tempWh == 11) result += el;
      else result += tempWh;

      fract *= 12;
      fract -= (tempWh * (Math.pow(10, fractLength)));
    }
  }

  return result;
}
