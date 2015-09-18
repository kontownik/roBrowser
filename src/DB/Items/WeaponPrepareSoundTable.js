/**
 * DB/Items/WeaponPrepareSoundTable.js
 *
 * Weapon sound table resources
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(["./WeaponType"], function( WeaponType )
{
	"use strict";


	var WeaponSound = {};

	WeaponSound[WeaponType.NONE]                  = "NONE";
	WeaponSound[WeaponType.SHORTSWORD]            = "attack_short_sword.wav";
	WeaponSound[WeaponType.SWORD]                 = "attack_sword.wav";
	WeaponSound[WeaponType.TWOHANDSWORD]          = "attack_twohand_sword.wav";
	WeaponSound[WeaponType.SPEAR]                 = "attack_spear.wav";
	WeaponSound[WeaponType.TWOHANDSPEAR]          = "attack_spear.wav";
	WeaponSound[WeaponType.AXE]                   = "attack_axe.wav";
	WeaponSound[WeaponType.TWOHANDAXE]            = "attack_axe.wav";
	WeaponSound[WeaponType.MACE]                  = "attack_mace.wav";
	WeaponSound[WeaponType.TWOHANDMACE]           = "attack_mace.wav";
	WeaponSound[WeaponType.ROD]                   = "attack_rod.wav";
	WeaponSound[WeaponType.BOW]                   = "attack_bow.wav";
	WeaponSound[WeaponType.KNUKLE]                = "NONE";
	WeaponSound[WeaponType.INSTRUMENT]            = "NONE";
	WeaponSound[WeaponType.WHIP]                  = "attack_whip.wav";
	WeaponSound[WeaponType.BOOK]                  = "attack_book.wav";
	WeaponSound[WeaponType.CATARRH]               = "NONE";
	WeaponSound[WeaponType.GUN_HANDGUN]           = "NONE";
	WeaponSound[WeaponType.GUN_RIFLE]             = "NONE";
	WeaponSound[WeaponType.GUN_GATLING]           = "NONE";
	WeaponSound[WeaponType.GUN_SHOTGUN]           = "NONE";
	WeaponSound[WeaponType.GUN_GRANADE]           = "NONE";
	WeaponSound[WeaponType.SYURIKEN]              = "NONE"; //not sure
	WeaponSound[WeaponType.TWOHANDROD]            = "attack_rod.wav";
	WeaponSound[WeaponType.SHORTSWORD_SHORTSWORD] = "attack_short_sword.wav";
	WeaponSound[WeaponType.SWORD_SWORD]           = "attack_sword.wav";
	WeaponSound[WeaponType.AXE_AXE]               = "attack_axe.wav";
	WeaponSound[WeaponType.SHORTSWORD_SWORD]      = "NONE";
	WeaponSound[WeaponType.SHORTSWORD_AXE]        = "NONE";
	WeaponSound[WeaponType.SWORD_AXE]             = "NONE";


	return WeaponSound;
});