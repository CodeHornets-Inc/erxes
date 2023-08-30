import { mutations, queries } from '../../../graphql';
import React from 'react';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { ITopic } from '../../../types';
import { TopicForm } from '../../../components/myCalendar/topic/Form';

type Props = {
  topic?: ITopic;
  meetingId: string;
  participantUserIds: string[];
  meetingStatus: string;
};

export const TopicFormContainer = (props: Props) => {
  // calls gql mutation for edit/add type
  const renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.editTopic : mutations.addTopic}
        variables={values}
        callback={callback}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${passedName}`}
        refetchQueries={{
          query: queries.meetingDetail,
          variables: {
            _id: props.meetingId
          }
        }}
      />
    );
  };

  const updatedProps = {
    ...props,
    renderButton
  };

  return <TopicForm {...updatedProps} />;
};
