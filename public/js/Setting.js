const saveButton = document.getElementById("save-Btn");
const musicCheckbox = document.getElementById("music-toggle");

localStorage.setItem("save-default-amount", SaveSetting.savedDefualtAmount);

let isChecked = true;

class Setting {
  constructor(
    savedRoundAmount,
    savedRoundDuration,
    savedRoundRestTime,
    saveIsBGMusic
  ) {
    const defaultAmount = 3;
    const m_MusicCheckboxLabel = "music-checkbox";

    if (localStorage.getItem("first-load") === null) {
      localStorage.setItem("save-default-amount", defaultAmount);

      document.getElementById("rounds").value = defaultAmount;
      document.getElementById("round-duration").value = defaultAmount;
      document.getElementById("rest-time").value = defaultAmount;

      localStorage.setItem("first-load", "true");
      localStorage.setItem("saved-round-amount", defaultAmount);
      localStorage.setItem("saved-duration", defaultAmount);
      localStorage.setItem("saved-rest-time", defaultAmount);
      localStorage.setItem("music-checkbox", "true");
    } else {
      this.m_SavedRoundAmount = savedRoundAmount;
      this.m_SaveRoundDuration = savedRoundDuration;
      this.m_SaveRoundRestTime = savedRoundRestTime;
      this.m_isBGMusicOn = saveIsBGMusic;

      document.getElementById("rounds").value = this.m_SavedRoundAmount;
      document.getElementById("round-duration").value =
        this.m_SaveRoundDuration;
      document.getElementById("rest-time").value = this.m_SaveRoundRestTime;

      this.CheckIsOn(musicCheckbox, m_MusicCheckboxLabel);
    }
  }

  HandleCheckboxs(checkbox, checkboxName) {
    if (checkbox.checked == true) {
      localStorage.setItem(checkboxName, "true");
    } else if (checkbox.checked == false) {
      localStorage.setItem(checkboxName, "false");
    }
  }

  CheckIsOn(checkbox, checkboxName) {
    if (localStorage.getItem(checkboxName) === "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  }

  HandleSaveSetting() {
    this.m_SavedRoundAmount = document.getElementById("rounds").value;
    localStorage.setItem("saved-round-amount", this.m_SavedRoundAmount);

    this.m_SaveRoundDuration = document.getElementById("round-duration").value;
    localStorage.setItem("saved-duration", this.m_SaveRoundDuration);

    this.m_SaveRoundRestTime = document.getElementById("rest-time").value;
    localStorage.setItem("saved-rest-time", this.m_SaveRoundRestTime);

    this.HandleCheckboxs(musicCheckbox, "music-checkbox");
  }
}

const userSettings = new Setting(
  SaveSetting.savedNumberOfRounds,
  SaveSetting.savedRoundDurationMins,
  SaveSetting.savedRestTimeMins,
  SaveSetting.savedIsSoundOn
);
saveButton.addEventListener("click", () => userSettings.HandleSaveSetting());
