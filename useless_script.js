function openSubmitPopup() {
  document.querySelector("#submit-popup").style.display = "block";
}

function closePopup(closeWhat) {
  document.querySelector(`#${closeWhat}`).style.display = "none";
}

function submitInfo() {
  let infoTitle = document.querySelector(`#form-info>input`).value;
  let infoText = document.querySelector(`#form-info>textarea`).value;

  let info = {
    title: infoTitle,
    text: infoText,
  };
  console.log("Collected this info: ", info);
}
