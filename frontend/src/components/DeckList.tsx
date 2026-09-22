import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import type { Deck } from '../types';

type Props = {
  decks: Deck[];
};

export function DeckList({ decks }: Props) {
  if (decks.length === 0) {
    return <Typography color="text.secondary">Колод пока нет</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {decks.map(deck => (
        <Grid key={deck.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%', '&:hover': { borderColor: 'primary.main' } }}>
            <CardActionArea component={Link} to={`/decks/${deck.id}`} sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {deck.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {deck.description}
                </Typography>
                <Typography variant="body2" color="primary">
                  Карточек: {deck.cards.length}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
