var compatibleLayout = function compatibleLayout(layout) {
  if (!layout) {
    return layout;
  }

  var layoutEnum = ['sidemenu', 'topmenu'];

  if (layoutEnum.includes(layout)) {
    return layout.replace('menu', '');
  }

  return layout;
};

export default compatibleLayout;