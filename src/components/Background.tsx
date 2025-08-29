export default function Background() {
  return (
    <div className="absolute inset-0 pointer-events-none ">
      <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-gradient-to-r from-background-gradient_blue_start/50 to-transparent rounded-full blur-3xl origin-top-left"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gradient-to-l from-background-gradient_blue_mid/50 to-transparent rounded-full blur-3xl origin-top-right"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-gradient-to-r from-background-gradient_teal/50 to-transparent rounded-full blur-3xl origin-bottom-left"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-gradient-to-l from-background-gradient_green_end/50 to-transparent rounded-full blur-3xl origin-bottom-right"></div>
    </div>
  );
}