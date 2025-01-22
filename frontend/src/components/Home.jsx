import React from 'react';
import "../components/Home.css";

const Home = () => {
  return (
    <>
      <div className="Home d-flex justify-content-center align-items-center flex-column">
        <div className='container'>
          <h1>Organize you Task with Task Manager</h1><br></br>
          <p>Track Monitors and Manages your Task with Task Manager</p>
          <button className="home-btn p-2">Create Task</button>
        </div>
      </div>
    </>
  );
}

export default Home;
