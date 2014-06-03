// avatar: A 1029x51 set of 21 avatar images.

exports.load = function(assetUrl, id) {
  var skinUrl = function(path) {
    if (path !== undefined) {
      return assetUrl('media/skins/' + id + '/' + path);
    } else {
      return null;
    }
  };
  var skin = {
    id: id,
    assetUrl: skinUrl,
    // Images
    avatar: skinUrl('avatar.png'),
    tiles: skinUrl('tiles.png'),
    goal: skinUrl('goal.png'),
    obstacle: skinUrl('obstacle.png'),
    smallStaticAvatar: skinUrl('small_static_avatar.png'),
    staticAvatar: skinUrl('static_avatar.png'),
    winAvatar: skinUrl('win_avatar.png'),
    failureAvatar: skinUrl('failure_avatar.png'),
    repeatImage: assetUrl('media/common_images/repeat-arrows.png'),
    leftArrow: assetUrl('media/common_images/moveleft.png'),
    downArrow: assetUrl('media/common_images/movedown.png'),
    upArrow: assetUrl('media/common_images/moveup.png'),
    rightArrow: assetUrl('media/common_images/moveright.png'),
    leftArrowSmall: assetUrl('media/common_images/draw-west-arrow.png'),
    downArrowSmall: assetUrl('media/common_images/draw-south-arrow.png'),
    upArrowSmall: assetUrl('media/common_images/draw-north-arrow.png'),
    rightArrowSmall: assetUrl('media/common_images/draw-east-arrow.png'),
    leftJumpArrow: assetUrl('media/common_images/jumpleft.png'),
    downJumpArrow: assetUrl('media/common_images/jumpdown.png'),
    upJumpArrow: assetUrl('media/common_images/jumpup.png'),
    rightJumpArrow: assetUrl('media/common_images/jumpright.png'),
    shortLineDraw: assetUrl('media/common_images/draw-short-line-crayon.png'),
    longLineDraw: assetUrl('media/common_images/draw-long-line-crayon.png'),
    clickIcon: assetUrl('media/common_images/when-click-hand.png'),
    startIcon: assetUrl('media/common_images/start-icon.png'),
    endIcon: assetUrl('media/common_images/end-icon.png'),
    randomPurpleIcon: assetUrl('media/common_images/random-purple.png'),
    // Sounds
    startSound: [skinUrl('start.mp3'), skinUrl('start.ogg')],
    winSound: [skinUrl('win.mp3'), skinUrl('win.ogg')],
    failureSound: [skinUrl('failure.mp3'), skinUrl('failure.ogg')]
  };
  return skin;
};
