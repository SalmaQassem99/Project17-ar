const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".game .card-wrapper .play");
const cardWrapper = document.querySelector(".game .cardContainer");
const body = document.querySelector(".body .body-items");
const infoIcon = document.querySelector(".info.icon");
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const textItemsContainers = document.querySelectorAll(
  ".match-cards .match-card-wrapper"
);
const textItems = document.querySelectorAll(
  ".match-cards .match-card-wrapper .match-card"
);
const cardsWrapper = document.querySelectorAll(".cards .cards-wrapper");
const cardsContainer = document.querySelectorAll(
  ".cards .cards-wrapper .cards-container"
);
const successModal = document.querySelector(".success-wrapper");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
let animationCounter = 0;
let counter = 0;
let textCounter = 0;
const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
const animateText = (index) => {
  textItems[index].style.visibility = "visible";
  textItems[index].classList.add("show");
  textItems[index].addEventListener("animationend", () => {
    if (textItems[index].classList.contains("show")) {
      textItems[index].classList.remove("show");
    }
  });
};
const animateNext = (i) => {
  cardsWrapper[i].style.visibility = "visible";
  cardsWrapper[i].classList.add("show");
  cardsWrapper[i].addEventListener("animationend", () => {
    if (cardsWrapper[i].classList.contains("show")) {
      cardsWrapper[i].classList.remove("show");
      cardsWrapper[i].style.transform = "translateY(0)";
      if (animationCounter === cardsWrapper.length - 1) {
        document.querySelector(".body-wrapper").style.overflow = "initial";
        //animate text
        animateText(textCounter);
      } else {
        animationCounter++;
        animateNext(animationCounter);
      }
    }
  });
};
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  cardWrapper.classList.add("hide");
  cardWrapper.addEventListener("animationend", () => {
    cardWrapper.classList.remove("hide");
    cardWrapper.style.visibility = "hidden";
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${textItems.length}`;
    body.classList.add("show");
    arrows.forEach((arrow) => {
      arrow.style.visibility = "visible";
    });
    pauseButton.style.visibility = "visible";
    animateNext(animationCounter);
  });
});
pauseButton.addEventListener("click", () => {
  const hiddenIcon = pauseButton.querySelector("i.hide");
  const shownIcon = pauseButton.querySelector("i:not(.hide)");
  hiddenIcon.classList.remove("hide");
  shownIcon.classList.add("hide");
});
textItems.forEach((textItem) => {
  textItem.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    event.dataTransfer.setData("id", textItem.dataset.index);
    event.dataTransfer.setData("indx", textItem.dataset.indx);
    document.querySelector(`audio[id="${textItem.dataset.index}"]`).play();
  });
  textItem.addEventListener("drag", (event) => {
    textItem.style.opacity = "0";
  });
  textItem.addEventListener("dragend", (event) => {
    textItem.style.opacity = "1";
  });
});
cardsContainer.forEach((cardItem) => {
  cardItem.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  cardItem.addEventListener("drop", (event) => {
    event.preventDefault();
    const index = cardItem.dataset.index;
    const textId = event.dataTransfer.getData("id");
    const textIndex = event.dataTransfer.getData("indx");
    const text = document.querySelector(
      `.match-cards .match-card-wrapper .match-card[data-indx="${textIndex}"]`
    );
    if (index === textId) {
      const textContent = text.textContent;
      counter += 1;
      document.querySelector(
        ".score"
      ).textContent = `${counter}/${textItems.length}`;
      document
        .querySelector(":root")
        .style.setProperty("--width", `${(100 / textItems.length) * counter}%`);
      const newItem = document.createElement("div");
      newItem.classList.add("card-item");
      newItem.textContent = textContent;
      cardItem.appendChild(newItem);
      newItem.style.visibility = "visible";
      newItem.classList.add("show");
      newItem.addEventListener("animationend", () => {
        newItem.classList.remove("show");
      });
      textItemsContainers[textCounter].setAttribute(
        "style",
        "display:none !important"
      );
      if (textCounter < textItems.length - 1) {
        textCounter++;
        animateText(textCounter);
      }
      const audio = document.querySelector("#correct-audio");
      audio.play();
      audio.addEventListener("ended", () => {
        if (counter === textItems.length) {
          const text = document.querySelector(".text-card .score-text");
          text.textContent = `${counter}/${textItems.length}`;
          text.setAttribute("text", `${counter}/${textItems.length}`);
          successModal.style.visibility = "visible";
          successModal.classList.add("show");
          overlay.classList.add("show");
          document.querySelector(`audio[id="success"]`).play();
        }
      });
    } else {
      document.querySelector("#wrong-audio").play();
      text.classList.add("vibrate");
      text.addEventListener("animationend", () => {
        if (text.classList.contains("vibrate")) {
          text.classList.remove("vibrate");
        }
      });
    }
  });
});
const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};
document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  animateInfo();
  let x = 100;
  textItemsContainers.forEach((item) => {
    item.style.zIndex = `${x}`;
    x--;
  });
});
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});
