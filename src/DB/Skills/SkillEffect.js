/**
 * DB/Skills/SkillEffect.js
 *
 * List of skills with informations (in progress)
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
//  effectId: hitEffectId: effectIdOnCaster:
define(['./SkillConst'], function( SK )
{
    'use strict';

    var SkillEffect = {};

    SkillEffect[SK.SM_PROVOKE] = {
        effectId: 67
    };
       
    SkillEffect[SK.SM_ENDURE] = {
        effectId: 11
    };

    SkillEffect[SK.SM_BASH] = {
        effectId: 16,
        hitEffectId: 1
    };

    SkillEffect[SK.KN_BOWLINGBASH] = {
        effectId: 149,
        hitEffectId: 1
    };
    
    SkillEffect[SK.LK_CONCENTRATION] = {
        effectId: 369
    };
    
    SkillEffect[SK.MG_SOULSTRIKE] = {
        effectId: 15,
        hitEffectId: 1
    };

    SkillEffect[SK.SM_MAGNUM] = {
        effectId: 17
    };

    SkillEffect[SK.AL_CRUCIS] = {
        effectId: 40
    };
    
    SkillEffect[SK.AL_TELEPORT] = {
        effectId: 304
    };

    SkillEffect[SK.MG_SAFETYWALL] = {
        effectId: 315,
        groundEffectId: '315_ground'
    };

    SkillEffect[SK.SA_DELUGE] = {
        groundEffectId: 'deluge_ground'
    };

    SkillEffect[SK.MG_STONECURSE] = {
        effectId: 23
    };

    SkillEffect[SK.MG_FIREWALL] =  {
        hitEffectId: 49,
        groundEffectId: 25
    };

    SkillEffect[SK.MG_LIGHTNINGBOLT] = {
        effectId: 29,
        hitEffectId: 52
    };

    SkillEffect[SK.MG_THUNDERSTORM] = {
        effectId: 30,
        hitEffectId: 52
    };

    SkillEffect[SK.AL_PNEUMA] = {
        groundEffectId: 141
    };

    SkillEffect[SK.AL_CRUCIS] = {
        effectId: 40
    };

    SkillEffect[SK.AL_ANGELUS] = {
        effectId: 41
    };

    SkillEffect[SK.AL_CURE] = {
        effectId: 66
    };

    SkillEffect[SK.MC_MAMMONITE] = {
        effectId: 10
    };

    SkillEffect[SK.AC_CONCENTRATION] = {
        effectId: 153
    };

    SkillEffect[SK.ALL_RESURRECTION] = {
        effectId: 77
    };

    SkillEffect[SK.KN_PIERCE] =  {
        effectIdOnCaster: 148
    };

    SkillEffect[SK.KN_BRANDISHSPEAR] = {
        effectId: 70,
        effectIdOnCaster: 144
    };

    SkillEffect[SK.KN_SPEARSTAB] =  {
        effectIdOnCaster: 150
    };

    SkillEffect[SK.KN_SPEARBOOMERANG] = {
        effectIdOnCaster: 151
    };

    SkillEffect[SK.KN_TWOHANDQUICKEN] = {
        effectId: 249
    };

    SkillEffect[SK.KN_AUTOCOUNTER] = {
        //effectId: 131
    };

    SkillEffect[SK.KN_BOWLINGBASH] = {
        effectId: 149
    };

    SkillEffect[SK.PR_IMPOSITIO] = {
        effectId: 84
    };

    SkillEffect[SK.PR_SUFFRAGIUM] = {
        effectId: 88
    };

    SkillEffect[SK.PR_ASPERSIO] = {
        effectId: 86
    };

    SkillEffect[SK.PR_BENEDICTIO] = {
        effectId: 91
    };

    SkillEffect[SK.PR_SANCTUARY] = {
        effectId: 83,
        groundEffectId: 319
    };

    SkillEffect[SK.NJ_KAENSIN] = {
        groundEffectId: 634
    };

    SkillEffect[SK.PR_STRECOVERY] = {
        effectId: 78
    };

    SkillEffect[SK.PR_KYRIE] = {
        effectId: 112
    };

    SkillEffect[SK.PR_MAGNIFICAT] = {
        effectId: 76
    };
    SkillEffect[SK.PR_GLORIA] = {
        effectId: 75
    };

    SkillEffect[SK.PR_LEXDIVINA] = {
        effectId: 87
    };

    SkillEffect[SK.PR_TURNUNDEAD] = {
        effectId: 152
    };

    SkillEffect[SK.PR_LEXAETERNA] = {
        effectId: 85
    };

    SkillEffect[SK.PR_MAGNUS] = {
        effectId: 113,
        hitEffectId: 152,
        groundEffectId: 318
    };

    SkillEffect[SK.WZ_METEOR] = {
        effectId: 92,
        hitEffectId: 49
    };

    SkillEffect[SK.WZ_VERMILION] = {
        effectId: 90,
        hitEffectId: 52
    };

    SkillEffect[SK.WZ_STORMGUST] = {
        effectId: 89
    };

    SkillEffect[SK.WZ_QUAGMIRE] = {
        groundEffectId: 95
    };

    SkillEffect[SK.BS_HAMMERFALL] = {
        effectId: 102
    };

    SkillEffect[SK.BS_WEAPONPERFECT] = {
        effectId: 103
    };

    SkillEffect[SK.BS_MAXIMIZE] = {
        effectId: 104
    };

    SkillEffect[SK.HT_SPRINGTRAP] = {
        effectId: 111
    };

    SkillEffect[SK.AS_SONICBLOW] = {
        effectId: 143
    };

    SkillEffect[SK.AS_POISONREACT] = {
        effectId: 126
    };

    SkillEffect[SK.AS_VENOMDUST] = {
        effectId: 124
    };

    SkillEffect[SK.AS_SPLASHER] = {
        effectId: 129
    };

    SkillEffect[SK.MC_CARTREVOLUTION] = {
        effectId: 170
    };

    SkillEffect[SK.MC_LOUD] = {
        effectId: 311
    };

    SkillEffect[SK.AL_HOLYLIGHT] = {
        effectId: 152
    };

    SkillEffect[SK.MG_ENERGYCOAT] = {
        effectId: 169
    };

    SkillEffect[SK.RG_STEALCOIN] = {
        effectId: 268
    };

    SkillEffect[SK.RG_STRIPWEAPON] = {
        effectId: 269
    };

    SkillEffect[SK.RG_STRIPSHIELD] = {
        effectId: 270
    };

    SkillEffect[SK.RG_STRIPARMOR] = {
        effectId: 271
    };

    SkillEffect[SK.RG_STRIPHELM] = {
        effectId: 272
    };

    SkillEffect[SK.CR_SHIELDCHARGE] = {
        effectId: 246
    };

    SkillEffect[SK.CR_HOLYCROSS] = {
        effectId: 245
    };

    SkillEffect[SK.CR_DEVOTION] = {
        effectId: 251
    };

    SkillEffect[SK.CR_PROVIDENCE] = {
        effectId: 248
    };

    SkillEffect[SK.CR_SPEARQUICKEN] = {
        effectId: 249
    };

    SkillEffect[SK.HP_ASSUMPTIO] = {
        effectId: 440
    };

    SkillEffect[SK.WS_MELTDOWN] = {
        effectId: 390
    };

    SkillEffect[SK.WS_CARTBOOST] = {
        effectId: 391
    };

    SkillEffect[SK.ST_REJECTSWORD] = {
        effectId: 392
    };

    SkillEffect[SK.SA_LANDPROTECTOR] = {
        groundEffectId: 242
    };

    SkillEffect[SK.BA_ASSASSINCROSS] = {
        groundEffectId: 287
    }

    SkillEffect[SK.BA_POEMBRAGI] = {
        groundEffectId: 288
    }

    SkillEffect[SK.BA_APPLEIDUN] = {
        groundEffectId: 289
    }

    SkillEffect[SK.AL_WARP] = {
        effectId: 35,
        groundEffectId: 317 //portal unit
    };

    SkillEffect[SK.AL_INCAGI] = {
        effectId: 37
    };

    SkillEffect[SK.AL_DECAGI] = {
        effectId: 38
    };

    SkillEffect[SK.AL_HOLYWATER] = {
        effectId: 39
    };

    SkillEffect[SK.AL_BLESSING] = {
        effectId: 42
    };

    SkillEffect[SK.PR_BENEDICTIO] = {
        effectId: 91
    };

    SkillEffect[SK.WZ_FIREPILLAR] = {
        effectId: 96,
        groundEffectId: 138
    }

    return SkillEffect;
});