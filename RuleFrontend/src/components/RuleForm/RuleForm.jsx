import React, { useState } from 'react'
import './RuleForm.css';
import axios from 'axios';
import { useFormContext } from '../../context/FormContext';
import Tree from 'react-d3-tree';

const RuleForm = () => { 
    const { formData, updateFormData } = useFormContext();
    const [responseMessage, setResponseMessage] = useState('');
    const [astData, setAstData] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formData.rule) {
            setResponseMessage('Enter something for the rule to be created');
            setTimeout(() => {
                setResponseMessage('');
            }, 3000);
            return;
        }
        try{ 
            const response = await axios.post('http://localhost:5000/api/rules/create-rule', {rule: formData.rule});
            setAstData(response.data.ast);
            setResponseMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setResponseMessage('Invalid Rule: ' + error.response.data.error); // Displaying error message from backend
            } else {
                setResponseMessage('An error occurred. Please try again later.');
            }
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

    return (
        <div className='add-rule'>
            <div className="container-left-create">
                <h2>Add New Rule</h2>
                <form className='rule-form' onSubmit={handleSubmit}>
                    <div className='rule-input'>
                        <textarea rows='5' value={formData.rule} placeholder="Enter Rule - Example - ((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)" onChange={(e) => updateFormData({ rule: e.target.value })} />
                        <div className="rule-input-btn">
                            <button type='submit'>Create Rule</button>
                        </div>
                        <div className='response'>
                            {responseMessage && <p>{responseMessage}</p>}
                        </div>
                    </div>
                </form>
            </div>
            <div className="container-right">
                <div className="ast-display-editor">
                    <h3>AST Representation</h3>
                    {astData && responseMessage && (
                        <Tree
                            data={transformASTToTree(astData)}
                            orientation="vertical"
                            translate={{ x: 400, y: 50 }}
                            pathFunc="straight"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default RuleForm
