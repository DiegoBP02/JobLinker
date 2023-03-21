import styled from "styled-components";

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  max-width: var(--max-width);
  margin: 0 auto;
  text-align: center;

  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary);
    cursor: pointer;
  }

  .logo {
    height: 4rem;
    margin-bottom: 2rem;
  }
  .mt {
    margin-top: 1.5rem;
  }

  label.radio {
    cursor: pointer;
    text-indent: 35px;
    overflow: visible;
    display: inline-block;
    position: relative;
  }

  label.radio:before {
    background: var(--primary);
    content: "";
    position: absolute;
    top: 2px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 100%;
  }

  input[type="radio"] {
    visibility: hidden;
  }

  label.radio:after {
    opacity: 0;
    content: "";
    position: absolute;
    width: 0.5em;
    height: 0.3em;
    background: transparent;
    top: 10px;
    left: 6px;
    border: 3px solid #ffffff;
    border-top: none;
    border-right: none;

    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  input[type="radio"]:checked + label:after {
    opacity: 1;
  }
`;

export default Wrapper;
