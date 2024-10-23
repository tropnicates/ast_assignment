import React, { useState } from 'react';
import axios from 'axios';
import './RuleEvaluator.css';
import { useFormContext } from '../../context/FormContext';

const RuleEvaluator = () => {
    const { formData, updateFormData } = useFormContext();
    const [eligibility, setEligibility] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ userData: { ...formData.userData, [name]: value } });
    };

    const handleEvaluate = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/rules/evaluate-rule', { data: formData.userData, rule: formData.ruleString });
            setEligibility(response.data.eligibility);
            setErrorMessage('');
        } catch (error) {
            // Check if the error has a response from the backend and if it does then set it as error message
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("An error occurred while evaluating the rule.");
            }
            setEligibility(null);
        }
    };

    return (
        <div className='eligibility-page'>
            <h2>Evaluate User Eligibility</h2>
            <div className='eligibility-form'>
                <div className='eligibility-user-info'>
                    <input type="number" name="age" value={formData.userData.age} onChange={handleInputChange} placeholder="Enter Age" />
                    <input type="text" name="department" value={formData.userData.department} onChange={handleInputChange} placeholder="Enter Department" />
                    <input type="number" name="salary" value={formData.userData.salary} onChange={handleInputChange} placeholder="Enter Salary" />
                    <input type="number" name="experience" value={formData.userData.experience} onChange={handleInputChange} placeholder="Enter Experience (years)" />
                </div>
                <div className="eligibility-rules">
                    <textarea value={formData.ruleString} onChange={(e)=> updateFormData({ ruleString: e.target.value })} placeholder="Enter AST rule to evaluate user on this rule basis(optional, otherwise the result is evaluated based on combined ast)" rows="10" cols="42" />
                </div>
                <div className="submit-button-div">
                    <button onClick={handleEvaluate} className='submit-button'>Evaluate Eligibility</button>
                    {eligibility !== null && (
                        <p>User Eligibility: {eligibility ? 'Eligible' : 'Not Eligible'}</p>
                    )}
                    {errorMessage && (
                        <p className="error-message">Error: {errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RuleEvaluator;