import React from "react";
import dhvaniProfile from "../images/dhvanimm.jpeg";
import anishProfile from "../images/anish.jpg";

const About = ({ setView }) => {
  return (
    <div className="w-full flex flex-col justify-center bg-[#a2b997] h-screen my-">
      <div className="m-4 lg:m-10 bg-[#a2b997] text-[#a2b997] font-bold">
        <section className="bg-white rounded-xl px-2 lg:px-6">
          <h1 className="text-7xl justify-center py-6 text-center">
            Meet The Team.
          </h1>
        </section>

        <section className="bg-white rounded-xl px-2 lg:px-6 mt-4 p-2 lg:p-6">
          <div className="max-w-lg">
            <h2 className="text-3xl"></h2>
            <h3 className="text-xl lg:text-2xl mt-2 text-left">
              Instructor Information: Dr. Abraham Aldaco
            </h3>
            <h3 className="text-xl lg:text-2xl mt-2 text-left">
              Course Name: 319 User Interface
            </h3>
            <h3 className="text-xl lg:text-2xl mt-2 text-left">
              Date: 4th May 2024
            </h3>
          </div>
        </section>

        <section className="bg-white rounded-xl px-2 lg:px-6 mt-4 p-2 lg:p-6">
          <div className="max-w-lg">
            <h2 className="text-3xl">The Team:</h2>
          </div>
          <div className="mt-2 lg:mt-6 lg:flex lg:space-x-6">
            <div className="my-2 lg:my-6 w-10/12 mx-auto lg:w-fit lg:m-0">
              <img
                src={dhvaniProfile}
                alt="Dhvani Mistry profile"
                height="200px"
                className="rounded-xl mx-auto h-[300px]"
                width="200px"
              />
              <h3 className="text-xl lg:text-2xl mt-2 text-center">
                Dhvani Mistry
              </h3>
              <p className="text-lg lg:text-xl text-center">
                Email: dhvanimm@iastate.edu
              </p>
            </div>
            <div className="my-2 lg:my-6 lg:w-fit w-10/12 mx-auto mt-4 lg:m-0">
              <img
                src={anishProfile}
                alt="Anish Chanda profile"
                height="200px"
                className="rounded-xl mx-auto h-[300px]"
                width="200px"
              />
              <h3 className="text-xl lg:text-2xl mt-2 text-center">
                Anish Chanda
              </h3>
              <p className="text-lg lg:text-xl text-center">
                Email: anish03@iastate.edu
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl px-2 lg:px-6 mt-4 p-2 lg:p-6">
          <div className="max-w-lg flex justify-between">
            <div>
              <h1
                className="text-3xl cursor-pointer"
                onClick={() => {
                  setView("");
                }}
              >
                To The WEBSITE: SoilSentry
              </h1>
            </div>
            <div></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
