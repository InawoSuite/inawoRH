import React, { useState, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const ImportModal = ({
  show,
  onCloseClick,
  title = "Importer un document",
  description = "Sélectionnez un fichier à importer",
  onImport,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx",
  maxSizeMB = 10,
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setError("");
      return;
    }

    // Vérification de la taille
    const maxSize = maxSizeMB * 1024 * 1024; // Convertir en octets
    if (selectedFile.size > maxSize) {
      setError(`Le fichier est trop volumineux. Taille maximum: ${maxSizeMB}MB`);
      setFile(null);
      return;
    }

    // Vérification de l'extension
    const fileName = selectedFile.name.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim());
    const fileExtension = '.' + fileName.split('.').pop();
    
    if (!acceptedExtensions.includes(fileExtension) && !acceptedExtensions.includes('.' + fileExtension)) {
      setError(`Type de fichier non accepté. Extensions autorisées: ${accept}`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleImport = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setLoading(true);
    try {
      await onImport(file);
      resetForm();
    } catch (err) {
      setError(err.message || "Erreur lors de l'importation");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onCloseClick();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={show}
      toggle={handleClose}
      centered
      className="border-0"
      contentClassName="rounded-4"
    >
      <ModalHeader
        toggle={handleClose}
        className="bg-light p-3 rounded-top-4"
      >
        <i className="ri-upload-cloud-line me-2"></i>
        {title}
      </ModalHeader>

      <ModalBody>
        {description && (
          <p className="text-muted mb-4">{description}</p>
        )}

        <Form>
          <FormGroup>
            <Label for="fileUpload" className="form-label fw-semibold">
              Sélectionner un fichier <span className="text-danger">*</span>
            </Label>
            
            <div
              className="border border-2 border-dashed rounded-4 p-5 text-center"
              style={{
                borderColor: error ? "#f06548" : "#405189",
                backgroundColor: error ? "#fff5f5" : "#f8f9fa",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="avatar-lg mx-auto mb-3">
                <div className="avatar-title bg-light text-primary rounded-circle">
                  <i className="ri-file-upload-line fs-2"></i>
                </div>
              </div>
              
              <h5 className="fs-5">Glissez-déposez votre fichier ici</h5>
              <p className="text-muted mb-0">ou cliquez pour parcourir</p>
              
              <Input
                innerRef={fileInputRef}
                id="fileUpload"
                type="file"
                className="d-none"
                onChange={handleFileChange}
                accept={accept}
              />
            </div>

            {error && (
              <Alert color="danger" className="mt-3 border-0">
                <i className="ri-error-warning-line me-2"></i>
                {error}
              </Alert>
            )}

            {file && (
              <div className="mt-3 p-3 bg-success-subtle rounded-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar-xs">
                      <div className="avatar-title bg-success text-white rounded">
                        <i className="ri-file-text-line"></i>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fs-6 mb-0">{file.name}</h6>
                        <p className="text-muted mb-0 fs-6">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                      <Button
                        color="link"
                        className="text-danger p-0"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <i className="ri-close-line fs-5"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3">
              <p className="text-muted mb-2">
                <i className="ri-information-line me-1"></i>
                <strong>Extensions acceptées :</strong> {accept}
              </p>
              <p className="text-muted mb-0">
                <i className="ri-information-line me-1"></i>
                <strong>Taille maximum :</strong> {maxSizeMB} MB
              </p>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter className="rounded-bottom-4">
        <Button
          color="light"
          onClick={handleClose}
          className="rounded-pill"
        >
          Annuler
        </Button>
        <Button
          color="primary"
          onClick={handleImport}
          className="rounded-pill"
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <i className="ri-loader-4-line me-1 spinner"></i>
              Importation en cours...
            </>
          ) : (
            <>
              <i className="ri-upload-line me-1"></i>
              Importer
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImportModal;