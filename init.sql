CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (id, title, author, description, image_url) VALUES
(1, 'The Brothers Karamazov', 'Fyodor Dostoevsky', 'A passionate philosophical novel set in 19th-century Russia, which explores ethical debates of God, free will, and morality.', '/images/books/brothers-karamazov.jpg'),
(2, 'East of Eden', 'John Steinbeck', 'A multigenerational family saga set in the Salinas Valley, California, exploring themes of good and evil through the intertwined stories of two families.', '/images/books/east-of-eden.jpg'),
(3, 'The Fifth Season', 'N.K. Jemisin', 'Set in a world where catastrophic climate change occurs regularly, this novel follows a woman searching for her daughter while navigating a society divided by powers.', '/images/books/fifth-season.jpg'),
(4, 'Jane Eyre', 'Charlotte Brontë', 'A novel about a strong-willed orphan who becomes a governess, falls in love with her employer, and discovers his dark secret.', '/images/books/jane-eyre.jpg'),
(5, 'Anna Karenina', 'Leo Tolstoy', 'A complex novel of family life among the Russian aristocracy, focusing on an adulterous affair between Anna Karenina and Count Vronsky.', '/images/books/anna-karenina.jpg'),
(6, 'Giovanni''s Room', 'James Baldwin', 'A groundbreaking novel that follows an American man living in Paris as he grapples with his sexual identity and relationships.', '/images/books/giovannis-room.jpg'),
(7, 'My Brilliant Friend', 'Elena Ferrante', 'The first novel in the Neapolitan quartet that traces the friendship between Elena and Lila, from their childhood in a poor Naples neighborhood through their diverging paths in life.', '/images/books/my-brilliant-friend.jpg'),
(8, 'The Remains of the Day', 'Kazuo Ishiguro', 'The story of an English butler reflecting on his life of service and missed opportunities as he takes a road trip through the countryside.', '/images/books/remains-of-the-day.jpg'),
(9, 'The Left Hand of Darkness', 'Ursula K. Le Guin', 'A science fiction novel that follows an envoy sent to convince the ambisexual people of the planet Gethen to join an interplanetary collective.', '/images/books/left-hand-of-darkness.jpg');