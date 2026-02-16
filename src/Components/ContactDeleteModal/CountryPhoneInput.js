import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import SimpleBar from "simplebar-react";
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

const PhoneInput = ({
  label,
  onBlur,
  onFocus,
  value = "",
  onChange,
  name = "phone",
  defaultCountry = "FR",
  countries,
  className = "",
  style = {},
}) => {
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen(prev => !prev);
  };

  // Initialiser le pays sélectionné
  React.useEffect(() => {
    if (countries && countries.length > 0) {
      const defaultCountryObj = countries.find(c => 
        c.countryIso === defaultCountry
      ) || countries[0];
      setSelectedCountry(defaultCountryObj);
    }
  }, [countries, defaultCountry]);

  const handleChange = (phoneNumber) => {
    if (typeof onChange === 'function') {
      onChange(phoneNumber);
    }
    
    if (phoneNumber) {
      try {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber, selectedCountry?.countryIso);
        setError(parsedNumber?.isValid() ? null : `Numéro invalide pour ${selectedCountry?.countryName}`);
      } catch (e) {
        setError(`Numéro invalide pour ${selectedCountry?.countryName}`);
      }
    } else {
      setError(null);
    }
  };

  const displayValue = React.useMemo(() => {
    if (!value || !selectedCountry) return "";
    
    try {
      const formatter = new AsYouType(selectedCountry.countryIso);
      const formatted = formatter.input(value);
      return formatted.replace(selectedCountry.countryCode, "");
    } catch (e) {
      return value.replace(selectedCountry.countryCode, "");
    }
  }, [value, selectedCountry]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    
    if (value) {
      const numberWithoutCode = value.replace(selectedCountry.countryCode, "");
      const newPhoneNumber = country.countryCode + numberWithoutCode;
      handleChange(newPhoneNumber);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    const fullNumber = selectedCountry.countryCode + inputValue;
    handleChange(fullNumber);
  };

  const handleInputFocus = (e) => {
    e.preventDefault();
    if (onFocus) onFocus(e);
  };

  if (!selectedCountry) return null;

  return (
    <div className={`mb-3 phone-input-wrapper ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className="input-group"   >
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle 
            tag="button" 
            className="btn btn-light border arrow-none"
            style={{ 
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
              borderRight: 'none'
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <img 
              src={selectedCountry.flagImg} 
              alt="country flag" 
              height="20" 
              className="me-1"
            />
            <span className="text-muted">{selectedCountry.countryCode}</span>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end" style={{ borderRadius: '10px' }}>
            <SimpleBar style={{ maxHeight: "220px" }}>
              {countries.map((country) => (
                <DropdownItem 
                  key={country.id}
                  onClick={() => handleCountryChange(country)}
                  active={selectedCountry.id === country.id}
                >
                  <div className="d-flex align-items-center">
                    <img 
                      src={country.flagImg} 
                      alt={country.countryName} 
                      width="20" 
                      className="me-2"
                    />
                    <span className="text-truncate">{country.countryName}</span>
                    <span className="ms-auto text-muted">{country.countryCode}</span>
                  </div>
                </DropdownItem>
              ))}
            </SimpleBar>
          </DropdownMenu>
        </Dropdown>
        <input
          type="tel"
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder="123456789"
          value={displayValue || ""}
          onChange={handleInputChange}
          onBlur={onBlur}
          onFocus={handleInputFocus}
          style={{
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
            borderLeft: 'none'
          }}
        />
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};
export default PhoneInput;