import React from "react";

export default function Header(props) {

  let direction = false;

  function updateDirection() {
    direction = !direction;
  }

  return (
    <header>
      <div className='header-inner'>
        <div className='logo'>CARS</div>
        <nav>
          <ul>
            <li className='btn' onClick={() => { props.changeDirection(direction); updateDirection();}}>
              <p>Swap direction</p>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
