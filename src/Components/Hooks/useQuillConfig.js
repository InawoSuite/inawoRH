import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Input, Label, Col, Row } from 'reactstrap';
import QuestionForm from './QuestionForm';
import { generateNewQuestion } from './Constants';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TYPE_QUIZ_CHOICES } from './Constants';
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const QuizForm = ({quiz, index, onChange, onRemove, isExam = false }) => {
    // ✅ CORRECTION : Utiliser directement quiz au lieu de créer currentQuiz
    const [isQuillReady, setIsQuillReady] = useState(false);
    const isUpdatingQuill = useRef(false);
    const previousQuizId = useRef(quiz?.id);

    // Configuration de Quill
    const { quill, quillRef } = useQuill({
        placeholder: "Rédigez la description du quiz ici...",
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'header': [1, 2, 3, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // ✅ CORRECTION : Initialisation de Quill améliorée
    useEffect(() => {
        if (quill && quiz) {
            // Réinitialiser si c'est un nouveau quiz
            if (previousQuizId.current !== quiz.id) {
                setIsQuillReady(false);
                previousQuizId.current = quiz.id;
            }

            if (!isQuillReady) {
                isUpdatingQuill.current = true;
                
                // Nettoyer d'abord l'éditeur
                quill.setContents([]);
                
                // Puis insérer le contenu si disponible
                if (quiz.description && quiz.description !== '<p><br></p>') {
                    quill.clipboard.dangerouslyPasteHTML(quiz.description);
                }
                
                isUpdatingQuill.current = false;
                setIsQuillReady(true);
            }
        }
    }, [quill, quiz?.id, quiz?.description, isQuillReady]);

    // ✅ CORRECTION : Handler Quill avec meilleure gestion
    useEffect(() => {
        if (quill && isQuillReady && quiz) {
            const handler = () => {
                if (isUpdatingQuill.current) return;

                const content = quill.root.innerHTML;
                
                // Éviter les mises à jour inutiles
                if (content === quiz.description) return;

                // ✅ IMPORTANT : Préserver tous les autres champs
                const updatedQuiz = { 
                    ...quiz, 
                    description: content 
                };
                
                if (typeof onChange === 'function') {
                    onChange(updatedQuiz);
                }
            };

            quill.on('text-change', handler);
            return () => quill.off('text-change', handler);
        }
    }, [quill, isQuillReady, quiz, onChange]);

    // ✅ CORRECTION : HandleChange simplifié et sécurisé
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        
        if (!quiz) return;
        
        let processedValue = value;
        
        // Traitement spécifique selon le champ
        if (name === 'pourcentage_requis') {
            if (value === '') {
                processedValue = '';
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                    return; // Ne pas mettre à jour si invalide
                }
                processedValue = numValue;
            }
        } else if (name === 'type_quiz' && isExam && value !== "EXAMEN_FINAL") {
            processedValue = "EXAMEN_FINAL";
        }
        
        // ✅ IMPORTANT : Préserver tous les champs existants
        const updatedQuiz = { 
            ...quiz, 
            [name]: processedValue 
        };
        
        if (typeof onChange === 'function') {
            onChange(updatedQuiz);
        }
    }, [quiz, isExam, onChange]);

    const addQuestion = useCallback(() => {
        if (!quiz) return;
        
        const newQuestion = generateNewQuestion();
        const updatedQuestions = [...(quiz.questions || []), newQuestion];
        
        const updatedQuiz = { 
            ...quiz, 
            questions: updatedQuestions 
        };
        
        if (typeof onChange === 'function') {
            onChange(updatedQuiz);
        }
    }, [quiz, onChange]);

    const handleQuestionChange = useCallback((updatedQuestion) => {
        if (!quiz) return;
        
        const updatedQuestions = (quiz.questions || []).map(q =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        
        const updatedQuiz = { 
            ...quiz, 
            questions: updatedQuestions 
        };
        
        if (typeof onChange === 'function') {
            onChange(updatedQuiz);
        }
    }, [quiz, onChange]);

    const handleQuestionRemove = useCallback((questionId) => {
        if (!quiz) return;
        
        const updatedQuestions = (quiz.questions || []).filter(q => q.id !== questionId);
        
        const updatedQuiz = { 
            ...quiz, 
            questions: updatedQuestions 
        };
        
        if (typeof onChange === 'function') {
            onChange(updatedQuiz);
        }
    }, [quiz, onChange]);

    // ✅ Protection contre quiz null/undefined
    if (!quiz) {
        return null;
    }

    return (
        <div className="quiz-section mt-4 p-3 bg-light" style={{ borderRadius: "20px" }}>
            <Row className="align-items-center mb-3">
                <Col md={10}>
                    <h6 className="fw-semibold mb-3 text-primary">
                        <i className="ri-questionnaire-line me-2"></i>
                        {quiz.titre || 'Nouveau Quiz'}
                    </h6>
                </Col>
                <Col md={2} className="text-end">
                    {!isExam && (
                        <Button
                            color="danger"
                            size="sm"
                            onClick={onRemove}
                            className="rounded-circle"
                        >
                            <i className="ri-delete-bin-line"></i>
                        </Button>
                    )}
                </Col>
            </Row>
            
            <Row>
                <Col md={12}>
                    <div className="mb-3">
                        <Label>Titre du quiz</Label>
                        <Input
                            name="titre"
                            value={quiz.titre || ''}
                            onChange={handleChange}
                            style={{ borderRadius: "20px" }}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <div className="mb-3">
                        <Label>Type de quizz</Label>
                        <Input 
                            type="select" 
                            name="type_quiz" 
                            value={quiz.type_quiz || ''}
                            onChange={handleChange}  
                            style={{ borderRadius: "20px" }}
                            disabled={isExam}
                        >
                            <option value="">Sélectionnez un type</option>
                            {TYPE_QUIZ_CHOICES.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Input>
                        {isExam && (
                            <small className="text-muted">
                                Le type est verrouillé pour les examens finaux
                            </small>
                        )}
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                        <Label>Pourcentage de validation requis (%)</Label>
                        <Input
                            name="pourcentage_requis"
                            type="text"
                            value={quiz.pourcentage_requis === '' ? '' : (quiz.pourcentage_requis || '')}
                            onChange={handleChange}
                            placeholder="70"
                            style={{ borderRadius: "20px" }}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <div className="mb-3">
                        <Label>Explication</Label>
                        <div className="snow-editor">
                            <div ref={quillRef} />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Liste des questions */}
            {(quiz.questions || []).map((question, idx) => (
                <QuestionForm
                    key={question.id || idx}
                    question={question}
                    index={idx}
                    onChange={handleQuestionChange}
                    onRemove={() => handleQuestionRemove(question.id)}
                />
            ))}

            <Button
                onClick={addQuestion}
                color="primary"
                style={{ borderRadius: "20px" }}
                className="mt-3"
            >
                <i className="ri-add-line me-1"></i> Ajouter une question
            </Button>
        </div>
    );
};

export default QuizForm;