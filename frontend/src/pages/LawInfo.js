import React from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function LawInfo() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBack />} component={RouterLink} to="/" sx={{ mb: 2 }}>Back to Home</Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Law & RTI Information
                </Typography>
                <Typography paragraph>
                    Know your fundamental rights and how to use the Right to Information (RTI) Act to ensure transparency.
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography fontWeight="bold">What is RTI (Right to Information)?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                The RTI Act allows any citizen to request information from a "public authority" (a body of Government or "instrumentality of State"). The authority is required to reply expeditiously or within thirty days.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography fontWeight="bold">Fundamental Rights</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                - Right to Equality (Articles 14–18)<br/>
                                - Right to Freedom (Articles 19–22)<br/>
                                - Right against Exploitation (Articles 23–24)<br/>
                                - Right to Constitutional Remedies (Article 32)
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography fontWeight="bold">Rights of an Arrested Person</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                - Right to know the grounds of arrest.<br/>
                                - Right to be produced before a magistrate within 24 hours.<br/>
                                - Right to consult a lawyer.<br/>
                                - Right to be examined by a medical practitioner.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Paper>
        </Container>
    );
}

export default LawInfo;