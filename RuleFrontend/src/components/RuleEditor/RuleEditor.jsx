import React, { useState, useEffect } from 'react'
import './RuleEditor.css'
import axios from 'axios';
import Select from 'react-select';
import { useFormContext } from '../../context/FormContext';
import Tree from 'react-d3-tree';
const RuleEditor = () => {
    const { formData, updateFormData } = useFormContext();
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [astData, setAstData] = useState(null);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rules/rule-list');
            setRules(response.data.rules);
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('No rules found. Please create a new rule to get started.');
            }
            else{
                setErrorMessage('Error fetching rules from the server.');
                console.error('Error fetching rules:', error);
            }
        }
    };

    const handleRuleSelection = (option) => {
        if (option) {
            const rule = rules.find(rule => rule._id === option.value);
            setSelectedRule(rule);
            updateFormData({ ruleString: rule.rule });
            setAstData(rule.ast);
        } else {
            setSelectedRule(null);
            updateFormData({ ruleString: '' });
            setAstData(null);
        }
    };

    const transformASTToTree = (node) => {
        if (!node) return null;
        const treeNode = {
            name: node.type,
            attributes: node.value && typeof node.value === 'string' ? { value: node.value } : { ...node.value },
            children: []
        };
    
        if (node.left) {
            treeNode.children.push(transformASTToTree(node.left));
        }
        if (node.right) {
            treeNode.children.push(transformASTToTree(node.right));
        }
    
        return treeNode;
    };

    const handleUpdateRule = async () => {
        if (!selectedRule) {
            alert('Please select a rule to update.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/rules/update-rule/${selectedRule._id}`, { rule: formData.ruleString });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            
            const updatedRule = response.data.updatedRule;
            setAstData(updatedRule.ast);

            await fetchRules();
            
            // setTimeout(() => {
            //     setSuccessMessage('');
            //     setSelectedRule(null);
            //     updateFormData({ ruleString: '' });
            // }, 5000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage('Invalid Rule: ' + error.response.data.error);
            } else {
                setErrorMessage('Failed to update the rule');
            }
            setSuccessMessage('');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        }
    };

    const options = rules.map(rule => ({
        value: rule._id,
        label: rule.rule,
    }));

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minWidth: '300px',
            maxWidth: '300px', 
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        }),
        menu: (provided) => ({
            ...provided,
            maxWidth: '300px',
        }),
        input: (provided) => ({
            ...provided,
            maxWidth: '280px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxWidth: '280px',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        }),
        singleValue: (provided) => ({
            ...provided,
            maxWidth: '280px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        }),
        placeholder: (provided) => ({
            ...provided,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }),
    };    

    return ( 
        <div className="rule-editor">
            <div className="container-left">
                <h2>Edit Existing Rule</h2>
                <div className='rule-editor-form'>
                    <div className='dropdown'>
                        <label>Select a Rule: </label>
                        <Select options={options} onChange={handleRuleSelection} isClearable isSearchable styles={customStyles}/>
                    </div>
                    {rules.length === 0 && (
                        <p style={{ color: 'red', marginTop: '10px', padding:'10px' }}>{errorMessage || 'No rules available, Create rules to Update them.'}</p>
                    )}
                </div>

                {selectedRule && (
                    <div className="edit-form">
                        <div className='edit-form-textBtn'>
                            <textarea rows="5" value={formData.ruleString} onChange={(e) => updateFormData({ ruleString: e.target.value })} placeholder="Edit the rule here" />
                            <button onClick={handleUpdateRule}>Update Rule</button>
                        </div>
                        <div className='success-msg'>
                            {successMessage && <p>{successMessage}</p>}
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                    </div>
                )}
            </div>
            <div className="container-right">
                <div className="ast-display-editor">
                    <h3>AST Representation</h3>
                    {astData && successMessage && (
                    <Tree
                        data={transformASTToTree(astData)}
                        orientation="vertical"
                        translate={{ x: 400, y: 50 }}
                        pathFunc="straight"
                    />
                    )}
                    {errorMessage && <p style={{ color: 'red' }}>No AST data available due to error.</p>}
                    {!astData && !successMessage && <p>No AST data available for the selected rule.</p>}
                </div>
            </div>
        </div>
    );
};

export default RuleEditor