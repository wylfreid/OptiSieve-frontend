import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../services/userService';
import { View, Text } from 'react-native';

const User = ({ user, loading, error, fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  loading: state.user.loading,
  error: state.user.error,
});

const mapDispatchToProps = {
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
