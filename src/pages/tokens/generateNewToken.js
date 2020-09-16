import React, { useContext, useCallback } from "react";
import { Classes, FormGroup, InputGroup, Button } from "@blueprintjs/core";
import { Formik } from "formik";
import * as Yup from 'yup';
import { FeathersContext } from "components/feathers";

const Schema = Yup.object().shape({
  'token-name': Yup.string()
    .min(3, "Too Short!")
    .max(36, "Too Long!")
    .required("Please fill this field")
})

const GenerateNewToken = ({ onClose }) => {
  const feathers = useContext(FeathersContext);
  const cancel = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <>
      <Formik
        initialValues={{
          'token-name': ''
        }}
        validationSchema={Schema}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            await feathers.tokens.create({
              name: values['token-name']
            });
            onClose();
          } catch (e) {
            setErrors({ submit: e.message });
            setSubmitting(false);
          }
        }}>
        {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                labelFor="token-name"
                intent={errors['token-name'] ? 'danger' : 'none'}
                helperText={errors['token-name']}>
                <InputGroup
                  values={values['new']}
                  defaultValue=""
                  onChange={handleChange}
                  intent={errors['token-name'] ? 'danger' : 'none'}
                  name="token-name"
                  placeholder="Enter a new dashboard Title" />
              </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button minimal
                  onClick={cancel}
                  text="Close"
                  intent="danger" />
                <Button
                  text="Submit"
                  type="submit"
                  loading={isSubmitting}
                  disabled={Object.entries(errors).length > 0}
                  intent="primary" />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  )
}

export default GenerateNewToken;