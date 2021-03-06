const express = require('express');
const mongoose = require('mongoose');

const attachmentsFilesModel = require('../models/attachments').files;
const stixModel = require('../models/schemaless');
const SecurityHelper = require('../helpers/security_helper');
const config = require('../config/config');

const router = express.Router();

router.get('/file/:stixId/:fileId', (req, res, next) => {
    if (config.blockAttachments) {
        next();
        return;
    }
    const { stixId, fileId } = req.params;

    const bucket = global.unfetter.gridFSBucket;
    if (!bucket || !stixId || !fileId) {
        return res.status(500).json({
            errors: [{
                status: 500, source: '', title: 'Error', code: '', detail: 'An unknown error has occurred.'
            }]
        });
    }

    stixModel.find(SecurityHelper.applySecurityFilter({ _id: stixId }, req.user), (stixErr, stixResult) => {
        if (stixErr || !stixResult || !stixResult.length) {
            return res.status(500).json({
                errors: [{
                    status: 500, source: '', title: 'Error', code: '', detail: 'An unknown error has occurred.'
                }]
            });
        }

        const stixResultObj = stixResult[0].toObject();
        const hasAttachment = stixResultObj.metaProperties &&
            stixResultObj.metaProperties.attachments &&
            stixResultObj.metaProperties.attachments.map(att => att._id).includes(fileId);
        if (!hasAttachment) {
            return res.status(404).json({
                errors: [{
                    status: 404, source: '', title: 'Error', code: '', detail: 'Request attachment not found on STIX object.'
                }]
            });
        }
        const idObj = new mongoose.mongo.ObjectID(fileId);
        attachmentsFilesModel.findById(idObj, (fileErr, fileResult) => {
            if (fileErr || !fileResult) {
                return res.status(500).json({
                    errors: [{
                        status: 500, source: '', title: 'Error', code: '', detail: 'An unknown error has occurred while.'
                    }]
                });
            }
            const fileObj = fileResult.toObject();

            const stream = bucket.openDownloadStream(idObj);
            stream.on('data', () => {
                // Only set attachment headers if we have valid data
                if (!res.getHeader('Content-disposition')) {
                    res.setHeader('Content-disposition', `attachment; filename=${fileObj.filename}`);
                }
            });

            stream.on('error', err => {
                console.log(err);
                return res.status(500).json({
                    errors: [{
                        status: 500, source: '', title: 'Error', code: '', detail: 'An error occured while attempting to retrieve the file'
                    }]
                });
            });

            stream.pipe(res);
        });
    })
    .limit(1);
});

module.exports = router;
