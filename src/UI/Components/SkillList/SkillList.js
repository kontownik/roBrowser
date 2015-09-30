import DB from 'DB/DBManager';
import SkillInfo from 'DB/Skills/SkillInfo';
import jQuery from 'Utils/jquery';
import Client from 'Core/Client';
import Preferences from 'Core/Preferences';
import Renderer from 'Renderer/Renderer';
import Mouse from 'Controls/MouseEventHandler';
import UIManager from 'UI/UIManager';
import UIComponent from 'UI/UIComponent';
import SkillTargetSelection from 'UI/Components/SkillTargetSelection/SkillTargetSelection';
import SkillDescription from 'UI/Components/SkillDescription/SkillDescription';
import htmlText from 'text!./SkillList.html';
import cssText from 'text!./SkillList.css';



var _preferences = Preferences.get('SkillList', {
    x:        100,
    y:        200,
    width:    8,
    height:   8,
    show:     false,
}, 1.0);


var _list = [];
var _points = 0;
var _btnLevelUp;



// this can't be just called at module loading time because the thread.js postmessage
// target isn't set then yet. Maybe it should keep some buffer/queue to allow that?
function makeLevelupButton(){
    var _levelup = jQuery(`<button class="btn levelup" data-background="basic_interface/skill_up_a.bmp" data-hover="basic_interface/skill_up_b.bmp" data-down="basic_interface/skill_up_c.bmp"></button>`);
    UIComponent.prototype.parseHTML.call(_levelup);
    return _levelup[0];
}

function _templateSkillRow(skill){
    var sk = SkillInfo[skill.SKID];


    var className = !skill.level ? 'disabled' : skill.type ? 'active' : 'passive';

    var skillLvlToggle = sk.bSeperateLv ? `
        <button class="btn skill_lv_decrease">&lt;</button>
        <button class="btn skill_lv_increase">&gt;</button>
    ` : '';

    var element = jQuery(`<tr class="skill id${skill.SKID} ${className}" data-index="${skill.SKID}" draggable="true">
            <td class="icon"><img class="iconImage" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="24" height="24" /></td>
            <td class="levelupcontainer"></td>
            <td class=selectable>
                <div class="name">
                    ${jQuery.escape(sk.SkillName)} <br/>
                    <span class="level">
                    ${skillLvlToggle}
                    ${(
                        sk.bSeperateLv ? 'Lv : <span class="current">'+ skill.current + '</span> / <span class="max">' + skill.level + '</span>'
                                       : 'Lv : <span class="current">'+ skill.level +'</span>'
                    )}
                    </span>
                </div>
            </td>
            <td class="selectable type">
                <div class="consume">
                ${(
                    skill.type ? 'Sp : <span class="spcost">' + skill.spcost + '</span>' : 'Passive'
                )}
                </div>
            </td>
        </tr>`)[0];

    Client.loadFile(`${DB.INTERFACE_PATH}item/${sk.Name}.bmp`, data => {
        element.getElementsByClassName('iconImage')[0].src = data;
    });

    if (skill.upgradable && _points > 0){
        let container = element.getElementsByClassName('levelupcontainer')[0];
        container.appendChild(makeLevelupButton());
    }

    return element;
}


function stopPropagation(event){
    event.stopImmediatePropagation();
    return false;
}


class SkillListUI extends UIComponent {
    constructor(){
        super('SkillList', htmlText, cssText);
    }

    init(){
        this.prepareUI(this.ui)
        this.prepareBtnLevelUp();
    }

    prepareBtnLevelUp(){
        _btnLevelUp = jQuery('#lvlup_job').detach();
        _btnLevelUp.click(function(){
            _btnLevelUp.detach();
            ui.show();
            ui.parent().append(ui);
        }).mousedown(stopPropagation);
    }

    prepareUI(ui){
        ui.find('.titlebar .base').mousedown(stopPropagation);
        ui.find('.footer .extend').mousedown(this.onResize.bind(this));
        ui.find('.titlebar .close').click(evt => {
            ui[0].style.display = 'none';
        });

        ui
            .on('click', '.levelup', this.onRequestSkillUp.bind(this))
            .on('click', '.skill_lv_increase', this.onSkillLvIncrease.bind(this))
            .on('click', '.skill_lv_decrease', this.onSkillLvDecrease.bind(this))
            .on('dblclick', '.skill .icon, .skill .name', this.onRequestUseSkill.bind(this))
            .on('contextmenu', '.skill .icon, .skill .name', this.onRequestSkillInfo.bind(this))
            .on('mousedown', '.selectable', this.onSkillFocus.bind(this))
            .on('dragstart', '.skill', this.onSkillDragStart.bind(this))
            .on('dragend', '.skill', evt => {
                delete window._OBJ_DRAG_;
            });

        this.draggable(this.ui.find('.titlebar'));
    }

    resize(width, height){
        width  = Math.min( Math.max(width,  8), 8);
        height = Math.min( Math.max(height, 4), 10);

        this.ui.find('.content').css({
            width:  width  * 32,
            height: height * 32
        });
    }

    onAppend(){
        // Apply preferences
        if (!_preferences.show) {
            this.ui[0].style.display = 'none';
        }

        this.resize(_preferences.width, _preferences.height);

        this.ui[0].style.top = Math.min( Math.max( 0, _preferences.y), Renderer.height - this.ui.height());
        this.ui[0].style.left = Math.min( Math.max( 0, _preferences.x), Renderer.width  - this.ui.width());
    }

    onRemove(){
        _btnLevelUp.detach();

        // Save preferences
        _preferences.show   =  this.ui.is(':visible');
        _preferences.y      =  parseInt(this.ui.css('top'), 10);
        _preferences.x      =  parseInt(this.ui.css('left'), 10);
        _preferences.width  =  Math.floor( this.ui.find('.content').width()  / 32 );
        _preferences.height =  Math.floor( this.ui.find('.content').height() / 32 );
        _preferences.save();
    }

    toggle(){
        this.ui.toggle();

        if (this.ui.is(':visible')) {
            this.focus();
            _btnLevelUp.detach();
        }
    }

    onShortCut(key){
        switch (key.cmd) {
            case 'TOGGLE':
                this.toggle();
                break;
        }
    }

    setSkills(skills){
        for (let skill of _list){
            this.onUpdateSkill(skill.SKID, 0);
        }

        _list.length = 0;
        this.ui.find('.content table').empty();

        for (let skill of skills) {
            this.addSkill(skill);
        }
    }

    addSkill(skill){
        // Custom skill ?
        if (!(skill.SKID in SkillInfo)) {
            return;
        }

        // Already in list, update it instead of duplicating it
        if (this.ui[0].getElementsByClassName(`.skill.id${skill.SKID}`).length) {
            this.updateSkill(skill);
            return;
        }
        var sk = SkillInfo[skill.SKID];

        if (sk.bSeperateLv && skill.current === undefined){
            skill.current = skill.level;
        }
        var element = _templateSkillRow(skill);

        this.ui.find('.content table')[0].appendChild(element);

        _list.push(skill);
        this.onUpdateSkill( skill.SKID, skill.level);
    }

    updateSkill(skill){
        var target = this.getSkillById(skill.SKID);
        var element;

        if (!target) {
            return;
        }

        var sk = SkillInfo[skill.SKID];

        if (sk.bSeperateLv && skill.current === undefined){
            skill.current = skill.level;
        }

        target.level = skill.level;
        target.current = skill.current;
        target.upgradable = skill.upgradable;

        if (skill.current){
            target.spcost = sk.SpAmount[target.current - 1];
            target.attackRange = sk.AttackRange[target.current - 1];
        } else {
            target.spcost = skill.spcost;
            target.attackRange = skill.attackRange;
        }

        if (target.spcost === undefined || target.attackRange === undefined){
            throw new Error('spcost or attackRange undefined?')
        }

        element = this.ui.find(`.skill.id${skill.SKID}:first`)[0];
        var updatedElement = _templateSkillRow(skill);
        var parent = element.parentElement;
        parent.replaceChild(updatedElement, element);

        this.onUpdateSkill(skill.SKID, skill.level);
    }

    removeSkill(){
        // Not implemented by gravity ? server have to send the whole list again ?
    }

    useSkillID(id, level){
        var skill = this.getSkillById(id);

        if (!skill || !skill.level || !skill.type) {
            return;
        }

        this.useSkill(skill, level);
    }

    useSkill(skill, level){
        if (level === undefined){
            level = skill.current;
        }
        // Self
        if (skill.type & SkillTargetSelection.TYPE.SELF) {
            this.onUseSkill(skill.SKID, level);
        }

        if (level !== skill.level){
            skill = Object.create(skill);
            skill.current = level;
        }

        // no elseif intended (see flying kick).
        if (skill.type & SkillTargetSelection.TYPE.TARGET) {
            SkillTargetSelection.append();
            SkillTargetSelection.set(skill, skill.type);
        }
    }

    setPoints(amount){
        this.ui.find('.skpoints_count').text(amount);

        // Do not need to update the UI
        if ((!_points) === (!amount)) {
            _points = amount;
            return;
        }

        _points = amount;

        for (let skill of _list){
            if (skill.upgradable){
                this.updateSkill(skill)
            }
        }

    }

    onLevelUp(){
        _btnLevelUp.appendTo('body');
    }

    getSkillById(id){
        for (let skill of _list) {
            if (skill.SKID === id) {
                return skill
            }
        }
        return null;
    }

    onRequestSkillUp(evt){
        var index = evt.target.parentNode.parentNode.getAttribute('data-index');
        this.onIncreaseSkill(
            parseInt(index, 10)
        );
    }

    onSkillLvDecrease(evt){
        var index = evt.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-index'); // lol
        var skill = this.getSkillById(parseInt(index, 10));
        if (skill.current > 1){
            skill.current--;
            this.updateSkill(skill);
        }
    }

    onSkillLvIncrease(evt){
        var index = evt.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-index');
        var skill = this.getSkillById(parseInt(index, 10));
        if (skill.current < skill.level){
            skill.current++;
            this.updateSkill(skill);
        }
    }


    onRequestUseSkill(evt){
        var main  = jQuery(evt.target).parent();

        if (!main.hasClass('skill')) {
            main = main.parent();
        }

        this.useSkillID(parseInt(main.data('index'), 10));
    }

    onRequestSkillInfo(evt){
        var main = jQuery(evt.target).parent();
        var skill;

        if (!main.hasClass('skill')) {
            main = main.parent();
        }

        skill = this.getSkillById(parseInt(main.data('index'), 10));

        // Don't add the same UI twice, remove it
        if (SkillDescription.uid === skill.SKID) {
            SkillDescription.remove();
            return;
        }

        // Add ui to window
        SkillDescription.append();
        SkillDescription.setSkill(skill.SKID);
    }

    onSkillFocus(evt){
        var main = jQuery(evt.target).parent();

        if (!main.hasClass('skill')) {
            main = main.parent();
        }

        this.ui.find('.skill').removeClass('selected');
        main.addClass('selected');
    }

    onSkillDragStart(event){
        var index = parseInt(event.currentTarget.getAttribute('data-index'), 10);
        var skill = this.getSkillById(index);

        // Can't drag a passive skill (or disabled)
        if (!skill || !skill.level || !skill.type) {
            return stopPropagation(event);
        }

        var img   = new Image();
        img.src = event.currentTarget.getElementsByTagName('img')[0].src;

        event.originalEvent.dataTransfer.setDragImage( img, 12, 12 );
        event.originalEvent.dataTransfer.setData('Text',
            JSON.stringify( window._OBJ_DRAG_ = {
                type: 'skill',
                from: 'SkillList',
                data:  skill
            })
        );
    }

    onResize(){
        var self = this;
        var ui      = SkillList.ui;
        var top     = ui.position().top;
        var left    = ui.position().left;
        var lastWidth  = 0;
        var lastHeight = 0;
        var _Interval;

        function resizing(){
            var extraX = -6;
            var extraY = 32;

            var w = Math.floor( (Mouse.screen.x - left - extraX) / 32 );
            var h = Math.floor( (Mouse.screen.y - top  - extraY) / 32 );

            // Maximum and minimum window size
            w = Math.min( Math.max(w, 8), 8);
            h = Math.min( Math.max(h, 4), 10);

            if (w === lastWidth && h === lastHeight) {
                return;
            }

            this.resize( w, h );
            lastWidth  = w;
            lastHeight = h;
        }

        // Start resizing
        _Interval = setInterval(resizing, 30);

        // Stop resizing on left click
        jQuery(window).on('mouseup.resize', function(event){
            if (event.which === 1) {
                clearInterval(_Interval);
                jQuery(window).off('mouseup.resize');
            }
        });
    }



    onUseSkill(){

    }

    onIncreaseSkill(){

    }

    onUpdateSkill(){

    }
}

export default UIManager.addComponent(new SkillListUI());
