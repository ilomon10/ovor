import React, { useMemo, useContext } from 'react';
import { Classes, Button, InputGroup, FormGroup } from '@blueprintjs/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FeathersContext } from 'components/feathers';

const DeleteToken = ({ onClose, data }) => {
  const feathers = useContext(FeathersContext);
  const Schema = useMemo(() => (Yup.object().shape({
    'last-word': Yup.string()
      .oneOf([(data.name).split(' ').join('_').toLowerCase()], 'Not match')
      .required('Field is required')
  })), [data.name]);
  return (
    <Formik
      initialValues={{
        'last-word': ''
      }}
      validationSchema={Schema}
      onSubmit={async (_value, { setErrors, setSubmitting }) => {
        try {
          await feathers.tokens.remove(data._id);
          onClose();
        } catch (e) {
          setErrors({ submit: e.message });
          setSubmitting(false);
        }
      }}>
      {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className={Classes.DIALOG_BODY}>
            <h5 className={Classes.HEADING}>You are about to delete this `{data.name}` token.</h5>
            <p>Deleted tokens will not be recoverable. Every device and application that uses a token will lose API access and need to be updated.</p>
            <p>Are you sure you want to delete your <strong>{data.name}</strong> token?</p>
            <InputGroup readOnly defaultValue={data.key} />
            <br />
            <FormGroup
              label={(<>Please type <strong>{(data.name).split(' ').join('_').toLowerCase()}</strong> to confirm</>)}
              labelFor={'last-word'}
              intent={errors['last-word'] ? 'danger' : 'none'}
              helperText={errors['last-word']}>
              <InputGroup
                name="last-word"
                onChange={handleChange}
                value={values['last-word']}
                placeholder="type here"
                intent={errors['last-word'] ? 'danger' : 'none'} />
            </FormGroup>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <Button fill
              text="I understand the consequences, delete this token"
              intent="danger"
              type="submit"
              loading={isSubmitting}
              disabled={Object.entries(errors).length > 0} />
          </div>
        </form>)}
    </Formik>
  )
}

export default DeleteToken;