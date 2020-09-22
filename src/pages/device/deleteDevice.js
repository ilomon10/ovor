import React, { useMemo, useContext } from 'react';
import { Classes, Button, InputGroup, FormGroup } from '@blueprintjs/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FeathersContext } from 'components/feathers';

const DeleteDevice = ({ onClose, onDeleted, data }) => {
  const feathers = useContext(FeathersContext);
  const Schema = useMemo(() => (Yup.object().shape({
    'last-word': Yup.string()
      .oneOf([(data['name']).split(' ').join('_').toLowerCase()], 'Not match')
      .required('Field is required')
  })), [data]);
  return (
    <Formik
      initialValues={{
        'last-word': ''
      }}
      validationSchema={Schema}
      onSubmit={async (_value, { setErrors, setSubmitting }) => {
        try {
          await feathers.devices.remove(data._id);
          onClose();
          onDeleted();
        } catch (e) {
          setErrors({ submit: e.message });
          setSubmitting(false);
        }
      }}>
      {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className={Classes.DIALOG_BODY}>
            <h5 className={Classes.HEADING}>You are about to delete this `{data['name']}` device.</h5>
            <p>Deleted device will not be recoverable. Every data and others that related to that device will get clean removed.</p>
            <p>Are you sure?</p>
            <FormGroup
              label={(<>Please type <strong>{(data['name']).split(' ').join('_').toLowerCase()}</strong> to confirm</>)}
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
              text="I understand the consequences, delete this device"
              intent="danger"
              type="submit"
              loading={isSubmitting}
              disabled={Object.entries(errors).length > 0} />
          </div>
        </form>)}
    </Formik>
  )
}

export default DeleteDevice;