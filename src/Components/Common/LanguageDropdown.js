import React, { useEffect, useState, useMemo } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { get, map } from "lodash";

//i18n
import i18n from "../../i18n";
import languages from "../../common/languages";
import axios from "axios";
import { BaseUrl } from "../../pages/APIKey/ApiKey";


const LanguageDropdown = () => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = authUser ? authUser.access : null;
    const userId = authUser ? authUser.user_id : null;
    const [selLang, setSelLang] = useState("");
    // Declare a new state variable, which we'll call "menu"
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem("I18N_LANGUAGE") || i18n.language || "fr");

    const normalizeLanguage = (value) => {
        const languageValue = String(value || "").trim().toLowerCase();

        if (["eng", "english", "en", "en-us", "en_us"].includes(languageValue)) {
            return "en";
        }

        if (["fr", "fre", "french", "français", "francais"].includes(languageValue)) {
            return "fr";
        }

        return null;
    };
    
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: `${BaseUrl}`,
            timeout: 60000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        instance.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        return instance;
    }, [token]);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            if (userId) {
              const {data}  = await axiosInstance.get(`/utilisateurs/update-profile/${userId}/`);
              setSelLang(data.langue);
            }
          } catch (err) {
           console.log("Erreur chargement langue:", err);
          }
        };
        fetchData();
      }, [axiosInstance, userId]);

    useEffect(() => {
        const normalizedLanguage = normalizeLanguage(selLang);

        if (!normalizedLanguage) {
            const persistedLanguage = localStorage.getItem("I18N_LANGUAGE") || i18n.language || "fr";
            const safeLanguage = persistedLanguage.startsWith("en") ? "en" : "fr";
            setSelectedLang(safeLanguage);
            i18n.changeLanguage(safeLanguage);
            return;
        }

        localStorage.setItem("I18N_LANGUAGE", normalizedLanguage);
        localStorage.setItem("i18nextLng", normalizedLanguage);
        setSelectedLang(normalizedLanguage);
        i18n.changeLanguage(normalizedLanguage);
    }, [selLang]);
    

    const changeLanguageAction = lang => {
        //set language as i18n
        i18n.changeLanguage(lang);
        localStorage.setItem("I18N_LANGUAGE", lang);
        localStorage.setItem("i18nextLng", lang);
        setSelectedLang(lang);
    };


    const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
    const toggleLanguageDropdown = () => {
        setIsLanguageDropdown(!isLanguageDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isLanguageDropdown} toggle={toggleLanguageDropdown} className="ms-1 topbar-head-dropdown header-item">
                <DropdownToggle className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" tag="button" data-onboarding-target="language-dropdown">
                    <img
                        src={get(languages, `${selectedLang}.flag`)}
                        alt="Header Language"
                        height="20"
                        className="rounded"
                    />
                </DropdownToggle>
                <DropdownMenu className="notify-item language py-2" id='lang'>
                    {Object.keys(languages).map(key => (
                        <DropdownItem
                            key={key}
                            onClick={() => changeLanguageAction(key)}
                            className={`notify-item ${selectedLang === key ? "active" : "none"
                                }`}
                        >
                            <img
                                src={get(languages, `${key}.flag`)}
                                alt="Skote"
                                className="me-2 rounded"
                                height="18"
                            />
                            <span className="align-middle">
                                {get(languages, `${key}.label`)}
                            </span>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};


// const LanguageDropdown = () => {
//     // Récupération du token depuis localStorage comme dans l'autre page qui fonctionne
//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [selLang, setSelLang] = useState("");
//     const [selectedLang, setSelectedLang] = useState("");
    
//     // Debug: vérifier ce qui est stocké
//     useEffect(() => {
//         console.log("🔍 DEBUG Storage:");
//         console.log("localStorage token:", localStorage.getItem("token"));
//         console.log("sessionStorage authUser:", sessionStorage.getItem("authUser"));
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             if (!token) {
//                 console.log("❌ Aucun token disponible dans localStorage");
                
//                 // Essayer de récupérer depuis sessionStorage comme backup
//                 try {
//                     const authUser = sessionStorage.getItem("authUser");
//                     if (authUser) {
//                         const parsed = JSON.parse(authUser);
//                         const sessionToken = parsed ? parsed.access : null;
//                         if (sessionToken) {
//                             console.log("✅ Token trouvé dans sessionStorage, mise à jour...");
//                             setToken(sessionToken);
//                             return; // On sort pour laisser le useEffect se relancer avec le nouveau token
//                         }
//                     }
//                 } catch (e) {
//                     console.error("Erreur lecture sessionStorage:", e);
//                 }
                
//                 console.log("🌐 Utilisation de la langue par défaut (fr)");
//                 setSelLang("fr");
//                 return;
//             }

//             console.log("🔄 Appel API avec token:", token.substring(0, 10) + "...");
            
//             const response = await fetch('https://inawoapiv3.inawo.pro/profile/', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': 'Bearer ' + token,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log("📊 Statut de la réponse:", response.status);
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("✅ DONNÉES COMPLÈTES API:", data);
//                 console.log("🌐 Langue spécifique:", data.langue);
//                 setSelLang(data.langue);
//             } else {
//                 console.error("❌ Erreur HTTP:", response.status);
//                 try {
//                     const errorText = await response.text();
//                     console.error("📄 Contenu de l'erreur:", errorText);
//                 } catch (e) {
//                     console.error("Impossible de lire le contenu de l'erreur");
//                 }
//                 // En cas d'erreur, utiliser le français par défaut
//                 setSelLang("fr");
//             }
//           } catch (err) {
//            console.error("🚨 Erreur fetch:", err);
//            // En cas d'erreur réseau, utiliser le français par défaut
//            setSelLang("fr");
//           }
//         };
        
//         fetchData();
//       }, [token]);

//     useEffect(() => {
//         if (selLang) {
//             console.log("🎯 Mise à jour de la langue:", selLang);
//             const currentLanguage = selLang === "Eng" ? "en" : "fr";
//             localStorage.setItem("I18N_LANGUAGE", currentLanguage);
//             localStorage.setItem("i18nextLng", currentLanguage);
//             setSelectedLang(currentLanguage);
//             i18n.changeLanguage(currentLanguage);
//             console.log("✅ Langue appliquée:", currentLanguage);
//         }
//     }, [selLang]);
    

//     const changeLanguageAction = lang => {
//         console.log("🔄 Changement manuel de langue:", lang);
//         i18n.changeLanguage(lang);
//         localStorage.setItem("I18N_LANGUAGE", lang);
//         localStorage.setItem("i18nextLng", lang);
//         setSelectedLang(lang);
//     };

//     const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
//     const toggleLanguageDropdown = () => {
//         setIsLanguageDropdown(!isLanguageDropdown);
//     };

//     // Vérifier si les languages sont définis avant de rendre
//     if (!languages || typeof languages !== 'object') {
//         console.error("❌ 'languages' n'est pas défini ou n'est pas un objet");
//         return (
//             <div className="ms-1 header-item">
//                 <button className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
//                     🌐
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <React.Fragment>
//             <Dropdown 
//                 isOpen={isLanguageDropdown} 
//                 toggle={toggleLanguageDropdown} 
//                 className="ms-1 topbar-head-dropdown header-item"
//             >
//                 <DropdownToggle 
//                     className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" 
//                     tag="button"
//                     type="button"
//                 >
//                     <img
//                         src={selectedLang && languages[selectedLang] ? languages[selectedLang].flag : ''}
//                         alt="Header Language"
//                         height="20"
//                         className="rounded"
//                         onError={(e) => {
//                             e.target.style.display = 'none';
//                             // Correction : remplacer l'optional chaining par une vérification classique
//                             if (e.target.nextSibling) {
//                                 e.target.nextSibling.style.display = 'inline';
//                             }
//                         }}
//                     />
//                     <span style={{display: 'none'}}>🌐</span>
//                 </DropdownToggle>
//                 <DropdownMenu className="notify-item language py-2" id='lang'>
//                     {Object.keys(languages).map(key => {
//                         const language = languages[key];
//                         const flagSrc = language ? language.flag : '';
//                         const label = language ? language.label : key;
                        
//                         return (
//                             <DropdownItem
//                                 key={key}
//                                 onClick={() => changeLanguageAction(key)}
//                                 className={`notify-item ${selectedLang === key ? "active" : "none"}`}
//                                 tag="div"
//                             >
//                                 <img
//                                     src={flagSrc}
//                                     alt={label}
//                                     className="me-2 rounded"
//                                     height="18"
//                                 />
//                                 <span className="align-middle">
//                                     {label}
//                                 </span>
//                             </DropdownItem>
//                         );
//                     })}
//                 </DropdownMenu>
//             </Dropdown>
//         </React.Fragment>
//     );
// };


export default LanguageDropdown;