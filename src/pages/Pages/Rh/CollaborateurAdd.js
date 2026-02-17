import React, { useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import { country } from "../../../common/data";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";

const CollaborateurAdd = () => {
	const navigate = useNavigate();
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [historyItems, setHistoryItems] = useState([]);
	const [historyForm, setHistoryForm] = useState({
		periode: "",
		poste: "",
		date: "",
		description: "",
	});
	const [selectedPays, setSelectedPays] = useState(null);
	const [contactValue, setContactValue] = useState("");

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

	const cardStyle = {
		borderRadius: "20px",
		background: "#fff",
		boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
	};

	document.title = "Collaborateur | INAWO - Suite de Gestion";

	const handleHistoryChange = (event) => {
		const { name, value } = event.target;
		setHistoryForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddHistory = (event) => {
		event.preventDefault();
		if (!historyForm.periode || !historyForm.poste || !historyForm.date || !historyForm.description) {
			return;
		}
		setHistoryItems((prev) => [
			...prev,
			{
				id: prev.length + 1,
				periode: historyForm.periode,
				poste: historyForm.poste,
				date: historyForm.date,
				description: historyForm.description,
			},
		]);
		setHistoryForm({ periode: "", poste: "", date: "", description: "" });
		setIsHistoryModalOpen(false);
	};

	return (
		<div className="page-content">
			<Container fluid>
				<BreadCrumb
					title="&nbsp;Ajouter un collaborateur"
					pageTitle={
						<>
							<i className="ri-team-line"></i>
							&nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
						</>
					}
				/>
				<Row>
					<Col lg={12}>
						<Form className="collaborateur-form" onSubmit={(event) => event.preventDefault()}>
							<Row className="mb-4">
								<Col lg={12}>
									<Card className="border-0" style={cardStyle}>
										<CardBody className="p-6">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-3">Informations personnelles</h6>
												</Col>
											</Row>
											<Row className="g-3">
												<Col md={6}>
													<FormGroup>
														<Label for="nom">Nom <span className="text-danger">*</span></Label>
														<Input id="nom" name="nom" type="text" placeholder="Nom" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="prenom">Prenom <span className="text-danger">*</span></Label>
														<Input id="prenom" name="prenom" type="text" placeholder="Prenom" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="datePrise">Date de prise de fonction <span className="text-danger">*</span></Label>
														<Input id="datePrise" name="datePrise" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="dateFin">Date de fin <span className="text-danger">*</span></Label>
														<Input id="dateFin" name="dateFin" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="typeContrat">Type de contrat <span className="text-danger">*</span></Label>
														<Input id="typeContrat" name="typeContrat" type="select" required>
															<option value="">Selectionner</option>
															<option value="cdi">CDI</option>
															<option value="cdd">CDD</option>
															<option value="stage">Stage professionnelle</option>
															<option value="interim">Alternatif</option>
															<option value="freelance">Freelance</option>
														</Input>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="dateNaissance">Date de naissance <span className="text-danger">*</span></Label>
														<Input id="dateNaissance" name="dateNaissance" type="date" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="lieuNaissance">Lieu de naissance (pays) <span className="text-danger">*</span></Label>
														<Input id="lieuNaissance" name="lieuNaissance" type="text" placeholder="Pays" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="enfants">Nombre d'enfants a charge <span className="text-danger">*</span></Label>
														<Input id="enfants" name="enfants" type="number" min="0" placeholder="0" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="statutMatrimonial">Statut matrimonial <span className="text-danger">*</span></Label>
														<Input id="statutMatrimonial" name="statutMatrimonial" type="select" required>
															<option value="">Selectionner</option>
															<option value="celibataire">Celibataire</option>
															<option value="engage">Engage</option>
															<option value="marie">Marie</option>
															<option value="divorce">Divorce</option>
															<option value="veuf">Veuf/Veuve</option>
														</Input>
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="adresse">Adresse <span className="text-danger">*</span></Label>
														<Input id="adresse" name="adresse" type="text" placeholder="Adresse" required />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="pays">Pays <span className="text-danger">*</span></Label>
														<CustomSelect
															value={selectedPays}
															onChange={(option) => setSelectedPays(option)}
															options={paysOptions}
															placeholder="Selectionner un pays"
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
													<FormGroup>
														<Label for="contact">Contact <span className="text-danger">*</span></Label>
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

							<Row className="mb-8">
								<Col lg={12}>
									<Card className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-3">Contact d'urgence</h6>
												</Col>
											</Row>
											<Row className="g-3">
												<Col md={6}>
													<FormGroup>
														<Label for="urgenceNom">Nom</Label>
														<Input id="urgenceNom" name="urgenceNom" type="text" placeholder="Nom" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="urgencePrenom">Prenom</Label>
														<Input id="urgencePrenom" name="urgencePrenom" type="text" placeholder="Prenom" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="urgenceAffiliation">Affiliation</Label>
														<Input id="urgenceAffiliation" name="urgenceAffiliation" type="text" placeholder="Mari, parents, enfant, femme" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="urgenceTelephone">Telephone</Label>
														<PhoneInput
															name="urgenceTelephone"
															value={contactValue}
															onChange={(value) => setContactValue(value)}
															countries={country}
															defaultCountry="BJ"
														/>
														{/* <Input id="urgenceTelephone" name="urgenceTelephone" type="text" placeholder="Telephone" /> */}
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="urgenceVille">Ville</Label>
														<Input id="urgenceVille" name="urgenceVille" type="text" placeholder="Ville" />
													</FormGroup>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
							</Row>

							<Row className="mb-6">
								<Col lg={12}>
									<Card className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3">
												<Col>
													<h6 className="text-uppercase text-muted mb-3">Poste et departement</h6>
												</Col>
											</Row>
											<Row className="g-3">
												<Col md={6}>
													<FormGroup>
														<Label for="poste">Poste</Label>
														<Input id="poste" name="poste" type="text" placeholder="Poste" />
													</FormGroup>
												</Col>
												<Col md={6}>
													<FormGroup>
														<Label for="departement">Departement</Label>
														<Input id="departement" name="departement" type="text" placeholder="Departement" />
													</FormGroup>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
							</Row>

							<Row className="mb-4">
								<Col lg={12}>
									<Card className="border-0" style={cardStyle}>
										<CardBody className="p-4">
											<Row className="mb-3 align-items-center">
												<Col>
													<h6 className="text-uppercase text-muted mb-0">Ajouter une historique professionelle</h6>
												</Col>
												<Col className="text-end">
													<Button
														color="primary"
														type="button"
														style={{ borderRadius: "20px" }}
														onClick={() => setIsHistoryModalOpen(true)}
													>
														Ajouter une historique
													</Button>
												</Col>
											</Row>
											<Row className="mb-0">
												<Col>
													{historyItems.length > 0 ? (
														<Table responsive className="align-middle">
															<thead>
																<tr>
																	<th>Periode</th>
																	<th>Poste</th>
																	<th>Date</th>
																	<th>Description</th>
																	{/* <th>Actions</th> */}
																</tr>
															</thead>
															<tbody>
																{historyItems.map((item) => (
																	<tr key={item.id}>
																		<td>{item.periode}</td>
																		<td>{item.poste}</td>
																		<td>{item.date}</td>
																		<td>{item.description}</td>
																		{/* <td>
																			<button type="button" className="btn btn-sm btn-soft-danger">Supprimer</button>
																		</td> */}
																	</tr>
																))}
															</tbody>
														</Table>
													) : (
														<p className="text-muted mb-0">Aucune historique ajoutee.</p>
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
													Annuler
												</Button>
												<Button
													color="primary"
													type="submit"
													style={{ borderRadius: "20px" }}
												>
													Enregistrer
												</Button>
											</div>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</Container>

			<Modal isOpen={isHistoryModalOpen} toggle={() => setIsHistoryModalOpen(false)} centered className="collaborateur-modal">
				<ModalHeader toggle={() => setIsHistoryModalOpen(false)}>Ajouter une historique</ModalHeader>
				<Form onSubmit={handleAddHistory}>
					<ModalBody>
						<Row className="g-3">
							<Col md={12}>
								<FormGroup>
									<Label for="periode">Periode (mois annee)</Label>
									<Input id="periode" name="periode" type="select" value={historyForm.periode} onChange={handleHistoryChange} required>
										<option value="">Selectionner</option>
										<option value="Janvier 2026">Janvier</option>
										<option value="Fevrier 2026">Fevrier</option>
										<option value="Mars 2026">Mars</option>
										<option value="Avril 2026">Avril</option>
										<option value="Mai 2026">Mai</option>
										<option value="Juin 2026">Juin</option>
										<option value="Juillet 2026">Juillet</option>
										<option value="Aout 2026">Aout</option>
										<option value="Septembre 2026">Septembre</option>
										<option value="Octobre 2026">Octobre</option>
										<option value="Novembre 2026">Novembre</option>
										<option value="Decembre 2026">Decembre</option>
									</Input>
								</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<Label for="posteHistorique">Poste</Label>
								<Input id="posteHistorique" name="poste" type="text" placeholder="Poste" value={historyForm.poste} onChange={handleHistoryChange} required />
							</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<Label for="dateHistorique">Date</Label>
								<Input id="dateHistorique" name="date" type="date" value={historyForm.date} onChange={handleHistoryChange} required />
							</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<Label for="descriptionHistorique">Description</Label>
								<Input id="descriptionHistorique" name="description" type="textarea" rows="3" placeholder="Description" value={historyForm.description} onChange={handleHistoryChange} required />
							</FormGroup>
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" type="button" style={{ borderRadius: "20px" }} onClick={() => setIsHistoryModalOpen(false)}>
						Annuler
					</Button>
					<Button color="primary" type="submit" style={{ borderRadius: "20px" }}>
						Enregistrer
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
		</div>
	);
};

export default CollaborateurAdd;
