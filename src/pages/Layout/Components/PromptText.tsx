import phoneMobile from '@/assets/images/device-phone-mobile.png';

// 提示文字組件
const PromptText = () => {
  return (
    <div className="hidden w-mobile-max flex-row items-center gap-6 p-2 sm:flex">
      <img src={phoneMobile} alt="Device Phone Mobile" className="h-5" />
      <p className="text-start text-t1 font-bold text-black-text-01">
        Poklist works best on mobile. Use a mobile device for the best
        experience.
      </p>
    </div>
  );
};

export default PromptText;
