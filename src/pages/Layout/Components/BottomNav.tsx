// 底部導航組件
const BottomNav = () => {
  return (
    <div className="text-tl hidden flex-row justify-center space-x-2 self-end py-2 font-bold text-black-text-01 sm:flex">
      <a href="/about" target="_blank">
        About
      </a>
      <span>|</span>
      <a href="/terms" target="_blank">
        Terms
      </a>
      <span>|</span>
      <a href="/privacy" target="_blank">
        Privacy
      </a>
    </div>
  );
};

export default BottomNav;
