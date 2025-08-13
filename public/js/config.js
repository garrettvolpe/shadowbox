const saveButton = document.getElementById('save-setting-bttn');
const musicToggle = document.getElementById('music-toggle');


const durationInput = document.getElementById('duration');
const restTimeInput = document.getElementById('rest-time');

const difficultySlider = document.getElementById('difficulty-slider');

const SaveSetting = {
    savedRoundDurationMins: localStorage.getItem('saved-duration'),
    savedRestTimeMins: localStorage.getItem('saved-rest-time'),
    saveNumberOfRounds: localStorage.getItem('saved-round-amount'),

};

class Setting
{
    constructor(savedRoundAmount, savedRoundDuration, saveRoundRestTime)
    {
        this.m_SavedRoundAmount = savedRoundAmount;
        this.m_SaveRoundDuration = savedRoundDuration;
        this.m_SaveRoundRestTime = saveRoundRestTime;

        document.getElementById('number-rounds').value = this.m_SavedRoundAmount;
        document.getElementById('duration').value = this.m_SaveRoundDuration;
        document.getElementById('rest-time').value = this.m_SaveRoundRestTime;
    }

    HandleSaveSetting()
    {
        this.m_SavedRoundAmount = document.getElementById('number-rounds').value;
        localStorage.setItem('saved-round-amount', this.m_SavedRoundAmount);

        this.m_SavedRoundAmount = document.getElementById('duration').value;
        localStorage.setItem('saved-duration', this.m_SavedRoundAmount);

        this.m_SaveRoundRestTime = document.getElementById('rest-time').value;
        localStorage.setItem('saved-rest-time', this.m_SaveRoundRestTime);
    }
}

const userSettings =
    new Setting(SaveSetting.saveNumberOfRounds, SaveSetting.savedRoundDurationMins, SaveSetting.savedRestTimeMins);
saveButton.addEventListener('click', () => userSettings.HandleSaveSetting());
