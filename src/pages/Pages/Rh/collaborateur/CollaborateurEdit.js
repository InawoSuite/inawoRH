import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import PhoneInput from "../../../../Components/ContactDeleteModal/CountryPhoneInput";
import { country } from "../../../../common/data";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import dummyImg from "../../../../assets/images/users/user-dummy-img.jpg";
import { useTranslation } from "react-i18next";

const CollaborateurEdit = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const { state } = location;
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [historyItems, setHistoryItems] = useState([]);
	const [historyForm, setHistoryForm] = useState({
		periode: "",
		poste: "",
		date: "",
		description: "",
	});
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [contactItems, setContactItems] = useState([]);
	const [contactForm, setContactForm] = useState({
		nom: "",
		prenom: "",
		contact: "",
		lien: "",
		ville: "",
	});

	const [selectedPays, setSelectedPays] = useState(null);
	const [selectedStatutMatrimonial, setSelectedStatutMatrimonial] = useState(null);
	const [selectedTypeContrat, setSelectedTypeContrat] = useState(null);
	const [contactValue, setContactValue] = useState("");
	const [photoFile, setPhotoFile] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [isHoraireModalOpen, setIsHoraireModalOpen] = useState(false);
	const [horaires, setHoraires] = useState([
		{ jour: "lundi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "19:00" },
		{ jour: "mardi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "19:00" },
		{ jour: "mercredi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "19:00" },
		{ jour: "jeudi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "19:00" },
		{ jour: "vendredi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "20:00" },
		{ jour: "samedi", ouvert: true, ouvert24h: false, heureDebut: "09:00", heureFin: "21:00" },
		{ jour: "dimanche", ouvert: false, ouvert24h: false, heureDebut: "09:00", heureFin: "19:00" },
	]);

	const paysOptions = useMemo(
		() =>
			country.map((c) => ({
				value: c.countryName,
				label: c.countryName,
				countryCode: c.countryCode,
				flagImg: c.flagImg,
			})),
		[]
	);

	const statutMatrimonialOptions = useMemo(
		() => [
			{ value: "celibataire", label: "Celibataire" },
			{ value: "engage", label: "Engage" },
			{ value: "marie", label: "Marie" },
			{ value: "divorce", label: "Divorce" },
			{ value: "veuf", label: "Veuf/Veuve" },
		],
		[]
	);

	const typeContratOptions = useMemo(
		() => [
			{ value: "cdi", label: "CDI" },
			{ value: "cdd", label: "CDD" },
			{ value: "stage", label: "Stage professionnelle" },
			{ value: "stage_academique", label: "Stage académique" },
			{ value: "interim", label: "Alternatif" },

		],
		[]
	);

	const collaborateursData = useMemo(() => ([
		{
			id: 1,
			nom: "Dupont",
			prenom: "Jean",
			affiliation: "Mari",
			email: "jean.dupont@inawo.com",
			telephone: "+229 97 00 00 01",
			ville: "Cotonou",
			poste: "Directeur Général",
			departement: "Direction",
			typecontrat: "CDI",
			statut: "actif"
		},
		{
			id: 2,
			nom: "Martin",
			prenom: "Marie",
			affiliation: "Femme",
			email: "marie.martin@inawo.com",
			telephone: "+229 97 00 00 02",
			ville: "Porto-Novo",
			poste: "Responsable RH",
			departement: "Ressources humaines",
			statut: "inactif",
			typecontrat: "CDD"
		},
		{
			id: 3,
			nom: "Durant",
			prenom: "Pierre",
			affiliation: "Enfant",
			email: "pierre.durant@inawo.com",
			telephone: "+229 97 00 00 03",
			ville: "Parakou",
			poste: "Comptable",
			departement: "Finance",
			statut: "actif",
			typecontrat: "Stage professionnelle"
		},
	]), []);

	const selectedCollaborateur = useMemo(() => {
		const fromState = state?.collaborateur;
		if (fromState) {
			return fromState;
		}
		return collaborateursData.find((item) => String(item.id) === String(id)) || null;
	}, [state, collaborateursData, id]);

	const [editData, setEditData] = useState({
		nom: "",
		prenom: "",
		poste: "",
		departement: "",
	});

	const handleEditChange = (event) => {
		const { name, value } = event.target;
		setEditData((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		if (!selectedCollaborateur) {
			return;
		}

		setEditData({
			nom: selectedCollaborateur.nom || "",
			prenom: selectedCollaborateur.prenom || "",
			poste: selectedCollaborateur.poste || "",
			departement: selectedCollaborateur.departement || "",
		});

		setContactValue(selectedCollaborateur.telephone || "");

		const selectedContrat = typeContratOptions.find(
			(option) => option.label === selectedCollaborateur.typecontrat
		);
		setSelectedTypeContrat(selectedContrat || null);
	}, [selectedCollaborateur, typeContratOptions]);

	useEffect(() => {
		const section = new URLSearchParams(location.search).get("section");
		if (!section) {
			return;
		}

		const target = document.getElementById(`section-${section}`);
		if (!target) {
			return;
		}

		setTimeout(() => {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 100);
	}, [location.search]);

	const cardStyle = {
		borderRadius: "20px",
		background: "#fff",
		boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
	};

	document.title = `${t("Modifier un collaborateur")} | INAWO - Suite de Gestion`;

	const handleHistoryChange = (event) => {
		const { name, value } = event.target;
		setHistoryForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleContactChange = (event) => {
		const { name, value } = event.target;
		setContactForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddHistory = (event) => {
		event.preventDefault();
		if (!historyForm.periode || !historyForm.poste || !historyForm.entreprise || !historyForm.description) {
			return;
		}
		setHistoryItems((prev) => [
			...prev,
			{
				id: prev.length + 1,
				periode: historyForm.periode,
				poste: historyForm.poste,
				entreprise: historyForm.entreprise,
				description: historyForm.description,
			},
		]);
		setHistoryForm({ periode: "", poste: "", entreprise: "", description: "" });
		setIsHistoryModalOpen(false);
	};

	const handleAddContact = (event) => {
		event.preventDefault();
		if (!contactForm.nom || !contactForm.prenom || !contactForm.contact || !contactForm.lien || !contactForm.ville) {
			return;
		}
		setContactItems((prev) => [
			...prev,
			{
				id: prev.length + 1,
				nom: contactForm.nom,
				prenom: contactForm.prenom,
				contact: contactForm.contact,
				lien: contactForm.lien,
				ville: contactForm.ville,
			},
		]);
		setContactForm({ nom: "", prenom: "", contact: "", lien: "", ville: "" });
		setIsContactModalOpen(false);
	};

	const handleHoraireChange = (index, field, value) => {
		const newHoraires = [...horaires];
		newHoraires[index][field] = value;

		if (field === "ouvert24h" && value === true) {
			newHoraires[index].heureDebut = "00:00";
			newHoraires[index].heureFin = "00:00";
			newHoraires[index].ouvert = true;
		}

		if (field === "ouvert" && value === false) {
			newHoraires[index].ouvert24h = false;
		}

		setHoraires(newHoraires);
	};

	const getHoraireSummary = () => {
		const joursOuverts = horaires.filter(h => h.ouvert);
		if (joursOuverts.length === 0) return t("Aucun horaire défini");
		if (joursOuverts.length === 7) {
			const tous24h = joursOuverts.every(h => h.ouvert24h);
			if (tous24h) return t("Ouvert 24h/24 - 7j/7");
		}
		return `${joursOuverts.length} ${t("jour(s) ouvert(s)")}`;
	};

	return (
		<div className="page-content">
			<Container fluid>
				<BreadCrumb
					title={`\u00a0${t("Modifier un collaborateur")}`}
					pageTitle={
						<>
							<i className="ri-team-line"></i>
							&nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
						</>
					}
				/>
				<Row>
					<Col lg={12}>
						<Form className="collaborateur-form" onSubmit={(event) => event.preventDefault()}>
							<Row className="mb-2">
								<Col lg={12}>
									<Card id="section-informations-personnelles" className="border-0" style={cardStyle}>
										<CardBody className="p-6">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-0">{t("Informations personnelles")}</h6>
												</Col>
											</Row>
											<Row className="gx-3 gy-0">
												<Col lg={12} className="text-center mb-0">
													<div className="position-relative d-inline-block">
														<div className="position-absolute bottom-0 end-0">
															<Label htmlFor="photo-input" className="mb-0">
																<div className="avatar-xs cursor-pointer">
																	<div className="avatar-title bg-light border rounded-circle text-muted">
																		<i className="ri-image-fill"></i>
																	</div>
																</div>
															</Label>
															<Input
																className="form-control d-none"
																id="photo-input"
																type="file"
																accept="image/*"
																onChange={(e) => {
																	const file = e.target.files[0];
																	if (file) {
																		setPhotoFile(file);
																		const reader = new FileReader();
																		reader.onload = (event) => {
																			setPhotoPreview(event.target.result);
																		};
																		reader.readAsDataURL(file);
																	}
																}}
															/>
														</div>
														<div className="avatar-lg p-1">
															<div className="avatar-title bg-light rounded-circle">
																<img
																	src={photoPreview || dummyImg}
																	alt="Collaborateur"
																	className="avatar-md rounded-circle object-fit-cover"
																	style={{ width: "100px", height: "100px", border: "5px solid #e9ecef" }}
																/>
															</div>
														</div>
													</div>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="nom">{t("Nom")} <span className="text-danger">*</span></Label>
														<Input id="nom" name="nom" type="text" placeholder={t("Nom")} value={editData.nom} onChange={handleEditChange} required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="prenom">{t("Prenom")} <span className="text-danger">*</span></Label>
														<Input id="prenom" name="prenom" type="text" placeholder={t("Prenom")} value={editData.prenom} onChange={handleEditChange} required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="dateNaissance">{t("Date de naissance")} <span className="text-danger">*</span></Label>
														<Input id="dateNaissance" name="dateNaissance" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="lieuNaissance">{t("Lieu de naissance (pays)")} <span className="text-danger">*</span></Label>
														<Input id="lieuNaissance" name="lieuNaissance" type="text" placeholder={t("Pays")} required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="enfants">{t("Nombre d'enfants a charge")} <span className="text-danger">*</span></Label>
														<Input id="enfants" name="enfants" type="number" min="0" placeholder="0" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="statutMatrimonial">{t("Statut matrimonial")} <span className="text-danger">*</span></Label>
														<CustomSelect
															inputId="statutMatrimonial"
															value={selectedStatutMatrimonial}
															onChange={(option) => setSelectedStatutMatrimonial(option)}
															options={statutMatrimonialOptions}
															placeholder={t("Selectionner")}
														/>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="adresse">{t("Adresse")} <span className="text-danger">*</span></Label>
														<Input id="adresse" name="adresse" type="text" placeholder={t("Adresse")} required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="pays">{t("Pays")} <span className="text-danger">*</span></Label>
														<CustomSelect
															value={selectedPays}
															onChange={(option) => setSelectedPays(option)}
															options={paysOptions}
															placeholder={t("Selectionner un pays")}
															formatOptionLabel={(option) => (
																<div className="d-flex align-items-center">
																	<img
																		src={option.flagImg}
																		alt={option.label}
																		className="me-2"
																		style={{ width: "20px", height: "15px", objectFit: "cover" }}
																	/>
																	{option.label}
																</div>
															)}
														/>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="contact">{t("Contact")} <span className="text-danger">*</span></Label>
														<PhoneInput
															name="contact"
															value={contactValue}
															onChange={(value) => setContactValue(value)}
															countries={country}
															defaultCountry="BJ"
														/>
													</FormGroup>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
							</Row>

							<Row className="mb-1">
								<Col lg={12}>
									<Card id="section-contact-urgence" className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-3">{t("Contact d'urgence")}</h6>
												</Col>
												<Col className="text-end">
													<Button
														color="primary"
														type="button"
														style={{ borderRadius: "20px" }}
														onClick={() => setIsContactModalOpen(true)}
													>
														{t("Ajouter un contact d'urgence")}
													</Button>
												</Col>
											</Row>

											<Row className="mb-0">
												<Col>
													{contactItems.length > 0 ? (
														<Table responsive className="align-middle">
															<thead>
																<tr>
																	<th>{t("Nom")}</th>
																	<th>{t("Prenom")}</th>
																	<th>{t("Contact")}</th>
																	<th>{t("Affiliation")}</th>
																	<th>{t("Ville")}</th>
																</tr>
															</thead>
															<tbody>
																{contactItems.map((item) => (
																	<tr key={item.id}>
																		<td>{item.nom}</td>
																		<td>{item.prenom}</td>
																		<td>{item.contact}</td>
																		<td>{item.lien}</td>
																		<td>{item.ville}</td>

																	</tr>
																))}
															</tbody>
														</Table>
													) : (
														<p className="text-muted mb-0">{t("Aucun contact d'urgence.")}</p>
													)}
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
							</Row>

							<Row className="mb-1">
								<Col lg={12}>
									<Card id="section-informations-contractuelles" className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-3">{t("Poste et departement")}</h6>
												</Col>
											</Row>
											<Row className="gx-3 gy-0">
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="poste">{t("Poste")}</Label>
														<Input id="poste" name="poste" type="text" placeholder={t("Poste")} value={editData.poste} onChange={handleEditChange} />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="departement">{t("Departement")}</Label>
														<Input id="departement" name="departement" type="text" placeholder={t("Departement")} value={editData.departement} onChange={handleEditChange} />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="datePrise">{t("Date de prise de fonction")} <span className="text-danger">*</span></Label>
														<Input id="datePrise" name="datePrise" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="dateFin">{t("Date de fin")} <span className="text-danger">*</span></Label>
														<Input id="dateFin" name="dateFin" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="typeContrat">{t("Type de contrat")} <span className="text-danger">*</span></Label>
														<CustomSelect
															inputId="typeContrat"
															value={selectedTypeContrat}
															onChange={(option) => setSelectedTypeContrat(option)}
															options={typeContratOptions}
															placeholder={t("Selectionner")}
														/>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="salaireBase">{t("Salaire de base")}</Label>
														<Input id="salaireBase" name="salaireBase" type="number" placeholder={t("Salaire de base")} step="0.01" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="salaireNet">{t("Salaire net")}</Label>
														<Input id="salaireNet" name="salaireNet" type="number" placeholder={t("Salaire net")} step="0.01" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="horaire">{t("Horaire")}</Label>
														<div className="d-flex gap-2">
															<Input
																id="horaire"
																name="horaire"
																type="text"
																placeholder={t("Cliquez pour définir")}
																value={getHoraireSummary()}
																readOnly
																style={{ cursor: "pointer" }}
																onClick={() => setIsHoraireModalOpen(true)}
															/>
															<Button
																color="primary"
																type="button"
																onClick={() => setIsHoraireModalOpen(true)}
																style={{ borderRadius: "8px" }}
															>
																<i className="ri-calendar-line"></i>
															</Button>
														</div>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup className="mb-0">
														<Label style={{ marginBottom: "0" }} for="fichier">{t("Fichier")}</Label>
														<Input id="fichier" name="fichier" type="file" lang="en" />
													</FormGroup>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
							</Row>

							<Row className="mb-1">
								<Col lg={12}>
									<Card id="section-historique-professionnelle" className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3 align-items-center">
												<Col>
													<h6 className="text-uppercase text-muted mb-0">{t("Ajouter un historique professionnel")}</h6>
												</Col>
												<Col className="text-end">
													<Button
														color="primary"
														type="button"
														style={{ borderRadius: "20px" }}
														onClick={() => setIsHistoryModalOpen(true)}
													>
														{t("Ajouter une expérience professionnelle")}
													</Button>
												</Col>
											</Row>
											<Row className="mb-0">
												<Col>
													{historyItems.length > 0 ? (
														<Table responsive className="align-middle">
															<thead>
																<tr>
																	<th>{t("Période")}</th>
																	<th>{t("Poste")}</th>
																	<th>{t("Entreprise")}</th>
																	<th>{t("Description")}</th>
																</tr>
															</thead>
															<tbody>
																{historyItems.map((item) => (
																	<tr key={item.id}>
																		<td>{item.periode}</td>
																		<td>{item.poste}</td>
																		<td>{item.entreprise}</td>
																		<td>{item.description}</td>
																	</tr>
																))}
															</tbody>
														</Table>
													) : (
														<p className="text-muted mb-0">{t("Aucun historique professionnel.")}</p>
													)}
												</Col>
											</Row>

										</CardBody>
									</Card>
									<div className="d-flex justify-content-end gap-2 mt-4">
										<Button
											color="secondary"
											type="button"
											style={{ borderRadius: "20px" }}
											onClick={() => navigate(-1)}
										>
											{t("Annuler")}
										</Button>
										<Button
											color="primary"
											type="submit"
											style={{ borderRadius: "20px" }}
										>
											{t("Enregistrer")}
										</Button>
									</div>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</Container>

			<Modal isOpen={isHistoryModalOpen} toggle={() => setIsHistoryModalOpen(false)} centered className="collaborateur-modal">
				<ModalHeader toggle={() => setIsHistoryModalOpen(false)}>{t("Ajouter une expérience professionnelle")}</ModalHeader>
				<Form onSubmit={handleAddHistory}>
					<ModalBody>
						<Row className="gx-3 gy-0">
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="periodeHistorique">{t("Période (mois année)")}</Label>
									<Input id="periodeHistorique" name="periode" type="date" placeholder={t("Période (mois année)")} value={historyForm.periode} onChange={handleHistoryChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="posteHistorique">{t("Poste")}</Label>
									<Input id="posteHistorique" name="poste" type="text" placeholder={t("Poste")} value={historyForm.poste} onChange={handleHistoryChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="entrepriseHistorique">{t("Entreprise")}</Label>
									<Input id="entrepriseHistorique" name="entreprise" type="text" placeholder={t("Entreprise")} value={historyForm.entreprise} onChange={handleHistoryChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="descriptionHistorique">{t("Description")}</Label>
									<Input id="descriptionHistorique" name="description" type="textarea" rows="1" placeholder={t("Description")} value={historyForm.description} onChange={handleHistoryChange} required />
								</FormGroup>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" type="button" style={{ borderRadius: "20px" }} onClick={() => setIsHistoryModalOpen(false)}>
							{t("Annuler")}
						</Button>
						<Button color="primary" type="submit" style={{ borderRadius: "20px" }}>
							{t("Enregistrer")}
						</Button>
					</ModalFooter>
				</Form>
			</Modal>

			<Modal isOpen={isContactModalOpen} toggle={() => setIsContactModalOpen(false)} centered className="collaborateur-modal">
				<ModalHeader toggle={() => setIsContactModalOpen(false)}>{t("Ajouter un contact d'urgence")}</ModalHeader>
				<Form onSubmit={handleAddContact}>
					<ModalBody>
						<Row className="gx-3 gy-0">
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="nom">{t("Nom")}</Label>
									<Input id="nom" name="nom" type="text" placeholder={t("Nom")} value={contactForm.nom} onChange={handleContactChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="prenom">{t("Prenom")}</Label>
									<Input id="prenom" name="prenom" type="text" placeholder={t("Prenom")} value={contactForm.prenom} onChange={handleContactChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="lien">{t("Affiliation")}</Label>
									<Input id="lien" name="lien" type="text" placeholder={t("Mari, parents, enfant, femme")} value={contactForm.lien} onChange={handleContactChange} required />
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="contact">{t("Téléphone")}</Label>
									<PhoneInput
										name="contact"
										value={contactForm.contact}
										onChange={(value) => setContactForm((prev) => ({ ...prev, contact: value }))}
										countries={country}
										defaultCountry="BJ"
									/>
								</FormGroup>
							</Col>
							<Col md={12}>
								<FormGroup>
									<Label style={{ marginBottom: "0" }} for="ville">{t("Ville")}</Label>
									<Input id="ville" name="ville" type="text" placeholder={t("Ville")} value={contactForm.ville} onChange={handleContactChange} required />
								</FormGroup>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" type="button" style={{ borderRadius: "20px" }} onClick={() => setIsContactModalOpen(false)}>
							{t("Annuler")}
						</Button>
						<Button color="primary" type="submit" style={{ borderRadius: "20px" }}>
							{t("Enregistrer")}
						</Button>
					</ModalFooter>
				</Form>
			</Modal>

			<Modal isOpen={isHoraireModalOpen} toggle={() => setIsHoraireModalOpen(false)} centered size="lg" className="collaborateur-modal">
				<ModalHeader toggle={() => setIsHoraireModalOpen(false)}>{t("Définir les horaires de travail")}</ModalHeader>
				<ModalBody>
					<div style={{
						border: "1px solid #e9ecef",
						borderRadius: "8px",
						padding: "15px",
						backgroundColor: "#f8f9fa"
					}}>
						{horaires.map((horaire, index) => (
							<Row key={index} className="gx-3 gy-0 align-items-center mb-2 pb-2" style={{ borderBottom: index < horaires.length - 1 ? "1px solid #e9ecef" : "none" }}>
								<Col xs={12} sm={3}>
									<div style={{
										fontWeight: "600",
										color: horaire.ouvert ? "#000" : "#6c757d",
										textTransform: "capitalize",
										fontSize: "14px"
									}}>
										{horaire.jour}
									</div>
								</Col>
								<Col xs={12} sm={9}>
									{horaire.ouvert ? (
										<Row className="gx-2 gy-0 align-items-center">
											<Col xs="auto">
												<Input
													type="time"
													value={horaire.heureDebut}
													onChange={(e) => handleHoraireChange(index, "heureDebut", e.target.value)}
													disabled={horaire.ouvert24h}
													style={{
														width: "110px",
														fontSize: "13px",
														padding: "4px 8px"
													}}
												/>
											</Col>
											<Col xs="auto" style={{ padding: "0 5px" }}>
												<span style={{ fontSize: "14px" }}>-</span>
											</Col>
											<Col xs="auto">
												<Input
													type="time"
													value={horaire.heureFin}
													onChange={(e) => handleHoraireChange(index, "heureFin", e.target.value)}
													disabled={horaire.ouvert24h}
													style={{
														width: "110px",
														fontSize: "13px",
														padding: "4px 8px"
													}}
												/>
											</Col>
											<Col xs="auto" className="ms-2">
												<Label check className="mb-0" style={{ fontSize: "13px" }}>
													<Input
														type="checkbox"
														checked={horaire.ouvert24h}
														onChange={(e) => handleHoraireChange(index, "ouvert24h", e.target.checked)}
														style={{ marginRight: "5px" }}
													/>
													24h/24
												</Label>
											</Col>
											<Col xs="auto">
												<Button
													color="link"
													size="sm"
													onClick={() => handleHoraireChange(index, "ouvert", false)}
													style={{
														fontSize: "13px",
														padding: "2px 8px",
														color: "#dc3545"
													}}
												>
													{t("Fermé")}
												</Button>
											</Col>
										</Row>
									) : (
										<Row className="gx-2 gy-0 align-items-center">
											<Col xs="auto">
												<span style={{
													fontSize: "14px",
													color: "#6c757d",
													fontWeight: "500"
												}}>
													{t("Fermé")}
												</span>
											</Col>
											<Col xs="auto">
												<Button
													color="link"
													size="sm"
													onClick={() => handleHoraireChange(index, "ouvert", true)}
													style={{
														fontSize: "13px",
														padding: "2px 8px",
														color: "#0ab39c"
													}}
												>
													{t("Ouvrir")}
												</Button>
											</Col>
										</Row>
									)}
								</Col>
							</Row>
						))}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" type="button" style={{ borderRadius: "20px" }} onClick={() => setIsHoraireModalOpen(false)}>
						{t("Annuler")}
					</Button>
					<Button color="primary" type="button" style={{ borderRadius: "20px" }} onClick={() => setIsHoraireModalOpen(false)}>
						{t("Enregistrer")}
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};


export default CollaborateurEdit;
