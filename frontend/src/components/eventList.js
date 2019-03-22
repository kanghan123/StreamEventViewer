import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '90%',
    maxWidth: 150,
    backgroundColor: theme.palette.background.paper,
  },
});

function SimpleList(props) {
  const { classes } = props;
  console.log(props.items)
  return (
    <div className={classes.root}>
      user follow from events
      {props.items.map((item, index) => (
        <ListItem key={index} item={item}>
            <div>
                    {index+1}
                    <Typography>
                    from:
                    {item.from_name}
                    </Typography>
                    <Typography>
                    to:
                    {item.to_name}
                    </Typography>
                    <Typography>
                    date:
                    {item.followed_at}
                    </Typography>
            </div>
        </ListItem>
      ))}
    </div>
  );
}

SimpleList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);