/**
 * Load Skin for Studio.
 */
// goal: A 20x34 goal image.
// background: Number of 400x400 background images. Randomly select one if
// specified, otherwise, use background.png.

var skinsBase = require('../skins');

var CONFIGS = {
  studio: {
  }
};

exports.load = function(assetUrl, id) {
  var skin = skinsBase.load(assetUrl, id);
  var config = CONFIGS[skin.id];

  skin.getTheme = function(name) {
    if (name === 'witch') {
      return skin;
    }
    return skin[name];
  };

  skin.hardcourt = {
    background: skin.assetUrl('background.png'),
  };
  skin.black = {
    background: skin.assetUrl('retro_background.png'),
  };
  skin.cave = {
    background: skin.assetUrl('background_cave.png'),
  };
  skin.night = {
    background: skin.assetUrl('background_santa.png'),
  };
  skin.cloudy = {
    background: skin.assetUrl('background_scifi.png'),
  };
  skin.underwater = {
    background: skin.assetUrl('background_underwater.png'),
  };
  /**
   * Sprite thumbs generated with:
   * `brew install graphicsmagick`
   * `gm convert +adjoin -crop 200x200 -resize 100x100 *spritesheet* output%02d.png`
   */
  skin.cat = {
    sprite: skin.assetUrl('cat_spritesheet_200px.png'),
    dropdownThumbnail: skin.assetUrl('cat_thumb.png'),
    spriteFlags: 28,
  };
  skin.dinosaur = {
    sprite: skin.assetUrl('dinosaur_spritesheet_200px.png'),
    dropdownThumbnail: skin.assetUrl('dinosaur_thumb.png'),
    spriteFlags: 28,
  };
  skin.dog = {
    sprite: skin.assetUrl('dog_spritesheet_200px.png'),
    dropdownThumbnail: skin.assetUrl('dog_thumb.png'),
    spriteFlags: 28,
  };
  skin.octopus = {
    sprite: skin.assetUrl('octopus_spritesheet_200px.png'),
    dropdownThumbnail: skin.assetUrl('octopus_thumb.png'),
    spriteFlags: 28,
  };
  skin.penguin = {
    sprite: skin.assetUrl('penguin_spritesheet_200px.png'),
    dropdownThumbnail: skin.assetUrl('penguin_thumb.png'),
    spriteFlags: 28,
  };

  // Images
  skin.goal = skin.assetUrl('goal.png');
  skin.goalSuccess = skin.assetUrl('goal_success.png');
  skin.sprite = skin.assetUrl('witch_sprite_200px.png');
  skin.dropdownThumbnail = skin.assetUrl('witch_thumb.png');
  skin.spriteFlags = 28; // flags: emotions, animation, turns
  skin.goalAnimation = skin.assetUrl('goal.gif');
  skin.approachingGoalAnimation =
      skin.assetUrl(config.approachingGoalAnimation);
  // Sounds
  skin.rubberSound = [skin.assetUrl('wall.mp3'), skin.assetUrl('wall.ogg')];
  skin.flagSound = [skin.assetUrl('win_goal.mp3'),
                    skin.assetUrl('win_goal.ogg')];
  skin.crunchSound = [skin.assetUrl('wall0.mp3'), skin.assetUrl('wall0.ogg')];
  skin.winPointSound = [skin.assetUrl('1_we_win.mp3'),
                        skin.assetUrl('1_we_win.ogg')];
  skin.winPoint2Sound = [skin.assetUrl('2_we_win.mp3'),
                         skin.assetUrl('2_we_win.ogg')];
  skin.losePointSound = [skin.assetUrl('1_we_lose.mp3'),
                         skin.assetUrl('1_we_lose.ogg')];
  skin.losePoint2Sound = [skin.assetUrl('2_we_lose.mp3'),
                          skin.assetUrl('2_we_lose.ogg')];
  skin.goal1Sound = [skin.assetUrl('1_goal.mp3'), skin.assetUrl('1_goal.ogg')];
  skin.goal2Sound = [skin.assetUrl('2_goal.mp3'), skin.assetUrl('2_goal.ogg')];
  skin.woodSound = [skin.assetUrl('1_paddle_bounce.mp3'),
                    skin.assetUrl('1_paddle_bounce.ogg')];
  skin.retroSound = [skin.assetUrl('2_paddle_bounce.mp3'),
                     skin.assetUrl('2_paddle_bounce.ogg')];
  skin.slapSound = [skin.assetUrl('1_wall_bounce.mp3'),
                    skin.assetUrl('1_wall_bounce.ogg')];
  skin.hitSound = [skin.assetUrl('2_wall_bounce.mp3'),
                   skin.assetUrl('2_wall_bounce.ogg')];

  // Settings
  if (config.background !== undefined) {
    var index = Math.floor(Math.random() * config.background);
    skin.background = skin.assetUrl('background' + index + '.png');
  } else {
    skin.background = skin.assetUrl('background.png');
  }
  skin.spriteHeight = config.spriteHeight || 100;
  skin.spriteWidth = config.spriteWidth || 100;
  skin.spriteYOffset = config.spriteYOffset || 0;
  skin.dropdownThumbnailWidth = 50;
  skin.dropdownThumbnailHeight = 50;
  return skin;
};
