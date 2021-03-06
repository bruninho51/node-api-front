import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const styles = {
    hidden: {
        display: "none"
    },
    hasError: {
        backgroundColor: "red"
    },
    error: {
        color: "red"
    },
    root: {
    '& .MuiTextField-root': {
      marginTop: '15px',
      width: 200,
    },
  },
};

class DynamicForm extends React.Component {

    constructor(props) {
        super(props);

        this.renderFields = this.renderFields.bind(this);
        this.renderGeneric = this.renderGeneric.bind(this);
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
                    'checkbox': this.renderCheckbox,
                };

                if (input.type !== 'component') {
                    const callback = components[input.type];
                    return callback ? callback(input) : this.renderGeneric(input);
                }

                return input.component;
            })
        );
    }

    renderGeneric(input) {
        let classes = this.props.classes;
        return (
            <Fragment key={input.name}>
                <div>
                    <Field 
                        name={input.name}
                        render={(props) => {
                            const { field, form } = props;
                            const { errors, touched } = props.form;
                            const error = errors[input.name] && touched[input.name] ? errors[input.name] : false;
                            return (
                                <React.Fragment>
                                    <TextField
                                      {... field}
                                      variant="outlined"
                                      type={input.type}
                                      label={input.label}
                                      style={{width: '100%'}}    
                                      multiline={!!input.multiline}
                                      rows={input.rows ? input.rows : false}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      InputProps={{
                                        inputProps: {
                                          min: input.min,
                                          max: input.max
                                        }
                                      }}
                                    />
                                    {error && 
                                        <React.Fragment>
                                            <br />
                                            <small 
                                                className={classes.error}>
                                                    * {error}
                                            </small>
                                        </React.Fragment>}
                                </React.Fragment>
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
                <div>
                    <Field 
                        name={input.name}
                        render={(props) => {
                            const { field } = props;
                            const { errors, touched } = props.form;
                            const hasError = errors[input.name] && touched[input.name] ? classes.hasError: "";
                            const defaultOption = <option key="default" value="Please select">Please Select</option>
                            const options = input.data.map(i => <MenuItem key={i} value={i}> {i} </MenuItem> );
                            const selectOptions = [defaultOption, ...options];
                            return (
                                <FormControl variant="outlined" style={{marginTop: '15px', width: '100%'}}>
                                    <InputLabel>{input.label}</InputLabel>
                                    <Select
                                        {...field}
                                        className={hasError}
                                        value={field.name}
                                    >
                                        {options}
                                    </Select>
                                </FormControl>
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
                                    <textarea {...field} className={hasError} style={{width: '100%'}}></textarea>
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
                <Formik 
                    onSubmit={this.props.handleSubmit}
                    validationSchema={this.props.validation}
                    validateOnChange={true}
                    initialValues={initialValues}
                    render={(form) => {
                        return (
                            <div>
                                <form className={classes.root} onSubmit={form.handleSubmit}>
                                    {this.renderFields(this.props.fields)}
                                    <br />
                                    <Button variant="contained" color="primary" type="submit">
                                        {this.props.btnName}
                                    </Button>
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