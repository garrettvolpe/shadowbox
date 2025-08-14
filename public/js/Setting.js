
const saveButton = document.getElementById('save-Btn');
const defaultAmount = 3;


class Setting
{
    constructor(savedRoundAmount, savedRoundDuration, savedRoundRestTime, saveIsSoundOn)
    {
        if (localStorage.getItem('first-load') === null)
        {
            localStorage.setItem('save-default-amount', defaultAmount);
            document.getElementById('rounds').value = defaultAmount;
            document.getElementById('round-duration').value = defaultAmount;
            document.getElementById('rest-time').value = defaultAmount;
            localStorage.setItem('first-load', 'true');
            localStorage.setItem('saved-round-amount', defaultAmount);
            localStorage.setItem('saved-duration', defaultAmount);
            localStorage.setItem('saved-rest-time', defaultAmount);
        }
        else
        {
            this.m_SavedRoundAmount = savedRoundAmount;
            this.m_SaveRoundDuration = savedRoundDuration;
            this.m_SaveRoundRestTime = savedRoundRestTime;

            document.getElementById('rounds').value = this.m_SavedRoundAmount;
            document.getElementById('round-duration').value = this.m_SaveRoundDuration;
            document.getElementById('rest-time').value = this.m_SaveRoundRestTime;
        }
    }

    HandleSaveSetting()
    {
        this.m_SavedRoundAmount = document.getElementById('rounds').value;
        localStorage.setItem('saved-round-amount', this.m_SavedRoundAmount);

        this.m_SaveRoundDuration = document.getElementById('round-duration').value;
        localStorage.setItem('saved-duration', this.m_SaveRoundDuration);

        this.m_SaveRoundRestTime = document.getElementById('rest-time').value;
        localStorage.setItem('saved-rest-time', this.m_SaveRoundRestTime);

        this
    }
}


const userSettings =
    new Setting(SaveSetting.savedNumberOfRounds, SaveSetting.savedRoundDurationMins, SaveSetting.savedRestTimeMins);
saveButton.addEventListener('click', () => userSettings.HandleSaveSetting());
