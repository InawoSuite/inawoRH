import React, { useState } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useOnboardingControl } from '../../Components/Hooks/useOnboardingControl';

const QuickHelpButton = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { restartOnboarding, canShowHelp } = useOnboardingControl();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  if (!canShowHelp()) return null;

  return (
    <div className="fixed-bottom text-end mb-3 me-3">
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="up">
        <DropdownToggle 
          tag={Button} 
          color="primary"
          style={{ 
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #014a92 0%, #1fa5f3 100%)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(1, 74, 146, 0.3)'
          }}
        >
          <i className="ri-guide-line me-1"></i>
          Aide
        </DropdownToggle>
        <DropdownMenu className="rounded-20">
          <DropdownItem onClick={restartOnboarding}>
            <i className="ri-restart-line me-2"></i>
            Redémarrer la visite guidée
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem 
            onClick={() => window.open('mailto:support@inawo.pro', '_blank')}
          >
            <i className="ri-customer-service-line me-2"></i>
            Contacter le support
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default QuickHelpButton;