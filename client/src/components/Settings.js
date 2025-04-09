import React from 'react';
import styled from 'styled-components';

const SettingsPanel = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-300px'};
  width: 300px;
  height: 100vh;
  background-color: ${props => props.isDarkMode ? '#2c3e50' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#f8f9fa' : '#2c3e50'};
  transition: left 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#4a6fa5' : '#e6e6e6'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${props => props.isDarkMode ? '#f8f9fa' : '#2c3e50'};
`;

const SettingsOption = styled.div`
  margin-bottom: 15px;
`;

const ToggleContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleLabel = styled.span`
  margin-right: 10px;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.isOn ? '#4a6fa5' : '#ccc'};
  border-radius: 12px;
  transition: background-color 0.3s;
  cursor: pointer;
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${props => props.isOn ? '28px' : '2px'};
    transition: left 0.3s;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const Settings = ({ isOpen, onClose, isDarkMode, toggleDarkMode }) => {
  return (
    <SettingsPanel isOpen={isOpen} isDarkMode={isDarkMode}>
      <SettingsHeader isDarkMode={isDarkMode}>
        <h3>Settings</h3>
        <CloseButton onClick={onClose} isDarkMode={isDarkMode}>×</CloseButton>
      </SettingsHeader>
      
      <SettingsOption>
        <ToggleContainer onClick={toggleDarkMode}>
          <ToggleLabel>Dark Mode</ToggleLabel>
          <HiddenCheckbox 
            checked={isDarkMode} 
            onChange={toggleDarkMode}
            readOnly
          />
          <ToggleSwitch isOn={isDarkMode} />
        </ToggleContainer>
      </SettingsOption>
    </SettingsPanel>
  );
};

export default Settings;
