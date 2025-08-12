-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to display tables
CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access on board_members" ON board_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about" ON about FOR SELECT USING (true);

-- Allow public insert access to contact form submissions
CREATE POLICY "Allow public insert on contact_form_submissions" ON contact_form_submissions FOR INSERT WITH CHECK (true);
