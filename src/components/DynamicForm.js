import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    hidden: {
        display: "none"
    },
    hasError: {
        backgroundColor: "red"
    },
    error: {
        backgroundColor: "red",
        color: "black"
    }
};

class DynamicForm extends React.Component {

    constructor(props) {
        super(props);

        this.renderFields = this.renderFields.bind(this);
        this.renderText = this.renderText.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.renderTextArea = this.renderTextArea.bind(this);
    }

    renderFields(inputs) {
        return (
            inputs.map(input => {

                const components = {
                    'select': this.renderSelect,
                    'textarea': this.renderTextArea,
                    'checkbox': this.renderCheckbox
                };

                const callback = components[input.type];

                return callback ? callback(input) : this.renderText(input);
            })
        );
    }

    renderText(input) {
        let classes = this.props.classes;
        return (
            <Fragment key={input.name}>
                <label>{input.label}</label>
                <div>
                    <Field 
                        name={input.name}
                        render={(props) => {
                            const { field, form } = props;
                            const { errors, touched } = props.form;
                            const hasError = errors[input.name] && touched[input.name] ? classes.hasError : "";
                            return (
                                <input 
                                    {... field}
                                    className={hasError}
                                    type="text"
                                />
                            );
                        }}
                    />
                </div>
            </Fragment>
        );
    }

    renderSelect(input) {
        let classes = this.props.classes;
        return (
            <Fragment key={input.name}>
                <label>{input.label}</label>
                <div>
                    <Field 
                        name={input.name}
                        render={(props) => {
                            const { field } = props;
                            const { errors, touched } = props.form;
                            const hasError = errors[input.name] && touched[input.name] ? classes.hasError: "";
                            const defaultOption = <option key="default" value="Please select">Please Select</option>
                            const options = input.data.map(i => <option key={i} value={i}> {i} </option> );
                            const selectOptions = [defaultOption, ...options];
                            return (
                                <div className="dropdown">
                                    <select value={field.name} {...field} className={hasError}>
                                        {selectOptions}
                                    </select><br />
                                </div>
                            );
                        }}
                    />
                </div>
            </Fragment>
        );
    }

    renderCheckbox(input) {
        return (
            <Fragment key={input.name}>
                <label>{input.label}</label>
                <Field 
                    name={input.name}
                    render={(props) => {
                        const { field } = props;
                        return (
                            <input 
                                name={input.name}
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                            />
                        );
                    }}
                />
            </Fragment>
        );
    }

    renderTextArea(input) {
        let classes = this.props.classes;
        return (
            <Fragment key={input.name}>
                <label>{input.label}</label>
                <div>
                    <Field 
                        name={input.name}
                        render={(props) => {
                            const { field } = props;
                            const { errors, touched } = props.form;
                            const hasError = errors[input.name] && touched[input.name] ? classes.hasError : '';

                            return (
                                <div>
                                    <textarea {...field} className={hasError}></textarea>
                                </div>
                            );
                        }}
                    />
                </div>
            </Fragment>
        );
    }

    getInitialValues(inputs) {
        const initialValues = {};
        inputs.forEach(field => {
            if(!initialValues[field.name]) {
                initialValues[field.name] = field.value;
            }
        });

        return initialValues;
    }

    render() {
        const initialValues = this.getInitialValues(this.props.fields);
        let classes = this.props.classes;
        return (
            <div className="app">
                <h1>Dynamic Form</h1>
                <Formik 
                    onSubmit={(values) => console.log(values)}
                    validationSchema={this.props.validation}
                    validateOnChange={true}
                    initialValues={initialValues}
                    render={(form) => {
                        const errorMessageShow = Object.keys(form.errors).length > 0 ? classes.error : classes.hidden;
                        return (
                            <div>
                                <form onSubmit={form.handleSubmit}>
                                    <div className={errorMessageShow}>
                                        Please correct the errors below
                                    </div>
                                    {this.renderFields(this.props.fields)}
                                    <br />
                                    <button type="submit" className="btn">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(DynamicForm);