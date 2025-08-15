const defaultAmount = 3;

const form = document.getElementById('config-form');
const settingButton = document.getElementById('setting-Btn');

let musicCheckbox = document.getElementById('music-toggle');
let crowdNoiseCheckbox = document.getElementById('crowd-toggle');
let soundNoiseCheckbox = document.getElementById('sound-toggle');
let boxerStyle = document.getElementById('b-style');
let kickboxerStyle = document.getElementById('kb-style');



class Setting
{
    constructor()
    {
        this.CheckFirstLoad('saved-round-amount', defaultAmount);
        this.CheckFirstLoad('saved-duration', defaultAmount);
        this.CheckFirstLoad('saved-rest-time', defaultAmount);
        this.CheckFirstLoad('saved-music-sound', 'true');
        this.CheckFirstLoad('saved-sound-sound', 'true');
        this.CheckFirstLoad('saved-crowd-sound', 'true');
        this.CheckFirstLoad('saved-style', 'kick-boxing')
    }


    HandleCheckboxs(checkbox, checkboxName)
    {
        if (checkbox.checked == true)
        {
            localStorage.setItem(checkboxName, 'true');
        }
        else if (checkbox.checked == false)
        {
            localStorage.setItem(checkboxName, 'false');
        }
    }

    CheckIsOn(checkbox, checkboxName)
    {
        if (localStorage.getItem(checkboxName) == 'true')
        {
            console.log(checkbox);
            checkbox.checked = true;
        }
        else
        {
            checkbox.checked = false;
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

        this.HandleCheckboxs(musicCheckbox, 'saved-music-sound');
        this.HandleCheckboxs(crowdNoiseCheckbox, 'saved-crowd-sound');
        this.HandleCheckboxs(soundNoiseCheckbox, 'saved-sound-sound');

        this.CheckUserStyle();


        console.log('button clicked');
    }

    CheckFirstLoad(check, defaultValue)
    {
        if (localStorage.getItem(check) == null || localStorage.getItem(check) == '')
        {
            localStorage.setItem(check, defaultValue);
        }
    }

    CheckUserStyle()
    {
        if (boxerStyle.checked == true)
        {
            localStorage.setItem('saved-style', 'boxer');
        }
        if (kickboxerStyle.checked == true)
        {
            localStorage.setItem('saved-style', 'kick-boxer');
        }
    }
}



const userSettings = new Setting();

form.addEventListener('submit', () => userSettings.HandleSaveSetting());
settingButton.addEventListener('click', function() {
    document.getElementById('config').classList.remove('hidden');
    document.getElementById('rounds').value = localStorage.getItem('saved-round-amount');
    document.getElementById('round-duration').value = localStorage.getItem('saved-duration');
    document.getElementById('rest-time').value = localStorage.getItem('saved-rest-time');

    userSettings.CheckIsOn(musicCheckbox, 'saved-music-sound');
    userSettings.CheckIsOn(crowdNoiseCheckbox, 'saved-crowd-sound');
    userSettings.CheckIsOn(soundNoiseCheckbox, 'saved-sound-sound');

    if (localStorage.getItem('saved-style') == 'kick-boxer')
    {
        kickboxerStyle.checked = true;
    }
    else
    {
        boxerStyle.checked = true;
    }
});
