import React from "react";
import { useNavigate } from "react-router-dom";

import rectangleImg from "../images/Rectangle.png";
import ellipse10 from "../images/Ellipse10.png";
import ellipse11 from "../images/Ellipse11.png";
import ellipse12 from "../images/Ellipse12.png";
import groupImage from "../images/Group.png";
import vector3 from "../images/Vector3.png";
import vector4Bird from "../images/Vector5.png";
import vector4Cloud from "../images/Vector4.png";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#8589EB] to-[#A3ABFF] overflow-hidden flex flex-col justify-between text-white">
      <div className="text-center mt-12 px-6 z-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to</h1>
        <h2 className="text-4xl sm:text-5xl font-bold text-yellow-100 mb-4">Solo Sparks</h2>
        <p className="text-sm sm:text-md text-white/90 max-w-md mx-auto">
          A personal growth journey built for you—track your reflections, earn rewards, and spark transformation.
        </p>
      </div>

      <div className="relative w-full h-[55vh] sm:h-[60vh] flex items-end justify-center z-10">
        <img
          src={vector4Cloud}
          alt="cloud-left"
          className="absolute top-8 sm:top-12 left-0 w-28 sm:w-36 h-auto z-20"
        />

        <img
          src={vector4Bird}
          alt="bird"
          className="absolute top-4 sm:top-8 right-10 w-20 sm:w-24 h-auto z-20"
        />

        <img src={ellipse10} alt="ellipse10" className="absolute bottom-28 w-[500px] sm:w-[600px] h-auto object-contain" />
        <img src={ellipse11} alt="ellipse11" className="absolute bottom-28 w-[400px] sm:w-[500px] h-auto object-contain" />
        <img src={ellipse12} alt="ellipse12" className="absolute bottom-28 w-[300px] sm:w-[400px] h-auto object-contain" />

        <img src={rectangleImg} alt="rectangle base" className="absolute bottom-0 w-full h-[200px] sm:h-[300px] object-cover" />

        <div className="absolute bottom-28 sm:bottom-36 flex flex-col items-center justify-center z-30">
          <img
            src={groupImage}
            alt="group"
            className="w-[220px] sm:w-[350px] h-auto mb-4"
          />

          <button
            onClick={() => navigate("/home")}
            className="bg-white text-[#2c2c54] font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-gray-100 transition text-sm sm:text-base"
          >
            GET STARTED
          </button>
        </div>

        {/*cloud right*/}
        <img
          src={vector3}
          alt="vector3"
          className="absolute top-12 sm:top-16 right-0 w-[120px] sm:w-[160px] h-auto z-20"
        />
      </div>
    </div>
  );
};

export default Splash;
