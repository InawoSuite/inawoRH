import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";

const JobDescription = () => {
  return (
    <React.Fragment>
      <Card className="rounded-4 border-0 shadow-sm">
        <CardBody>
          <h5 className="mb-3">Description du poste</h5>

          <p className="text-muted mb-2">
            Un(e) Designer Produit dans une entreprise est responsable de l'expérience 
            utilisateur d'un produit, ce qui inclut généralement la prise en compte 
            des objectifs commerciaux définis par la gestion de produit. Les designers 
            produit sont généralement associés aux aspects visuels ou tactiles d'un 
            produit, mais ils peuvent également jouer un rôle dans l'architecture de 
            l'information et la conception système d'un produit.
          </p>
          <p className="text-muted mb-4">
            Le métier de designer produit est un choix de carrière exceptionnel. La 
            demande pour les designers produit augmente chaque jour, mais il existe 
            une énorme pénurie de designers produit qualifiés sur le marché. Avec du 
            travail acharné et un ensemble de compétences approprié, un designer 
            produit peut gagner une somme d'argent considérable.
          </p>
          
          <div>
            <h5 className="mb-3">Responsabilités du Designer Produit</h5>
            <p className="text-muted">
              Voici les responsabilités d'un Designer Produit :
            </p>
            <ul className="text-muted vstack gap-2">
              <li>
                Visualiser et créer des dessins et concepts de design pour 
                déterminer le meilleur produit.
              </li>
              <li>
                Présenter les idées et concepts aux membres de l'équipe concernés 
                pour des séances de brainstorming.
              </li>
              <li>Transformer les concepts de design en prototypes fonctionnels.</li>
              <li>
                Analyser, modifier et réviser les designs ou produits existants 
                pour répondre aux attentes des clients.
              </li>
              <li>
                Coordonner avec les membres de l'équipe et assurer une efficacité 
                précise dans la phase de conception.
              </li>
              <li>Excellent sens du détail</li>
              <li>Méticuleux(se) et assidu(e)</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3">Compétences & Expérience</h5>
            <ul className="text-muted vstack gap-2">
              <li>Compétences en communication</li>
              <li>Bonnes capacités de visualisation</li>
              <li>Capacité d'observation</li>
              <li>Capacités de résolution de problèmes</li>
              <li>
                Sens de l'esthétique et compréhension des préférences des clients
              </li>
              <li>Esprit artistique et innovant</li>
              <li>Bonne connaissance de l'industrie et des tendances du marché</li>
              <li>
                Expérience professionnelle pertinente dans le domaine requise
              </li>
            </ul>
          </div>

          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <h5 className="mb-0">Partager cette offre :</h5>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="btn btn-icon btn-soft-info">
                <i className="ri-facebook-line"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="btn btn-icon btn-soft-success">
                <i className="ri-whatsapp-line"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="btn btn-icon btn-soft-secondary">
                <i className="ri-twitter-line"></i>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#" className="btn btn-icon btn-soft-danger">
                <i className="ri-mail-line"></i>
              </Link>
            </li>
          </ul>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default JobDescription;