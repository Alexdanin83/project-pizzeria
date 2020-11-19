
class Main{
  constructor(wrapper){
    const thisMain = this;
    thisMain.initMain(wrapper);
  }
  initMain(wrapper){
    addEventListener( 'DOMContentLoaded', function () {
      /* global Splide */
      new Splide(wrapper,{
        'heightRatio': 0.5,
        'autoplay' :   true,
        'interval' : 3000,
        'type':'loop',
        'height': 250,
      } ).mount();
    } );
  }
}
export default Main;
